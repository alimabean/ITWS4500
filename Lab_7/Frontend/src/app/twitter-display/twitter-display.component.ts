import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { trigger, animate, transition, state, style } from '@angular/animations';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-twitter-display',
  templateUrl: './twitter-display.component.html',
  styleUrls: ['./twitter-display.component.css'],
  providers: [WebSocketService],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ]),
  ]
})
export class TwitterDisplayComponent implements OnInit, OnDestroy {
  tweetsInfo = [];
  tweets = [];
  location: String;
  location_placeholder: String = 'Longitude | Latitude';
  count_placeholder: String = 'Tweet count';
  count: String;
  connection;
  fileConnection;
  selected: String = 'json';
  file;

  constructor(private webSocket: WebSocketService) { }

  // Send the Lat, Lon to server via websocket service
  sendLocation(): void {
    this.webSocket.sendLocation(this.location, this.count);
    this.location = '';
    this.count = '';
  }
  // Empty the tweets array, removing the tweets from the display
  clearTweets(): void {
    this.tweets = [];
    this.webSocket.deleteAllTweets();
  }
  // Extract screen_name and text from tweet
  parseTweet(tweet): Array<string> {
    return [tweet[5], tweet[2]];
  }
  // Subscribe to the websocket observable and fill the tweetsInfo array
  getTweets(): void {
    this.connection = this.webSocket.getTweets().subscribe((tweets) => {
      this.tweetsInfo = <any>tweets;
      this.tweets = this.tweets.concat((<any>tweets).map(tweet => this.parseTweet(tweet)));
    });
  }

  // Parse the tweets into JSON structure
  generateJson(): string {
    let json = '{"tweets":[';
    this.tweetsInfo.forEach((tweet) => {
      json +=
       `{"created_at":"${tweet[0]}",
        "id":"${tweet[1]}",
        "text":"${tweet[2]}",
        "user_id":"${tweet[3]}",
        "user_name":"${tweet[4]}",
        "user_screen_name":"${tweet[5]}",
        "user_location":"${tweet[6]}",
        "user_followers_count":"${tweet[7]}",
        "user_friends_count":"${tweet[8]}",
        "user_created_at":"${tweet[9]}",
        "user_time_zone":"${tweet[10]}",
        "user_profile_background_color":"${tweet[11]}",
        "user_profile_image_url":"${tweet[12]}",
        "geo":"${tweet[13]}",
        "coordinates":"${tweet[14]}",
        "place":"${tweet[15]}"},\n`;
    });
    json.slice(0, -1);
    json += ']}';
    return json;
  }

  // Parse tweets into CSV format
  generateCsv(): string {
    let csvContent = '"created_at","id","text","user_id","user_name","user_screen_name",' +
      '"user_location","user_followers_count","user_friends_count","user_created_at",' +
      '"user_time_zone","user_profile_background_color","user_profile_image_url","geo","coordinates","place"\r\n';
    (this.tweetsInfo).forEach(row => {
      row = row.map(item => item === null ? "null" : item);
      row = row.map(item => `"${item}"`);
      csvContent += row.join(',') + '\r\n';
    });
    return csvContent;
  }

  generateXml(): string {
    let xmlContent = '<tweets>';
    (this.tweetsInfo).forEach((tweet) => {
      xmlContent += '<tweet>';
      xmlContent +=
        `<created_at>${tweet[0]}</created_at>` +
        `<id>${tweet[1]}</id>` +
        `<text>${tweet[2]}</text>` +
        `<user_id>${tweet[3]}</user_id>` +
        `<user_name>${tweet[4]}</user_name>` +
        `<user_screen_name>${tweet[5]}</user_screen_name>` +
        `<user_location>${tweet[6]}</user_location>` +
        `<user_followers_count>${tweet[7]}</user_followers_count>` +
        `<user_friends_count>${tweet[8]}</user_friends_count>` +
        `<user_created_at>${tweet[9]}</user_created_at>` +
        `<user_time_zone>${tweet[10]}</user_time_zone>` +
        `<user_profile_background_color>${tweet[11]}</user_profile_background_color>` +
        `<user_profile_image_url>${tweet[12]}</user_profile_image_url>` +
        `<geo>${tweet[13]}</geo>` +
        `<coordinates>${tweet[14]}</coordinates>` +
        `<place>${tweet[15]}</place>`;
      xmlContent += '</tweet>';
    });
    xmlContent += '</tweets>';
    return xmlContent;
  }

  // Create a Blob object from the tweets, download the file
  generateFile(): void {
    const file = new Blob([this.selected === 'json' ?
      this.generateJson() : (this.selected === 'csv' ? this.generateCsv() : this.generateXml())], {
      type: `text/${this.selected}`,
    });
    saveAs(file, `limaa-tweets.${this.selected}`);
  }

  requestTweetsForFile(query) {
    this.webSocket.requestTweetsForFile(query);
  }

  // Verify that the user has tweets to download
  getFile(): void {
    this.webSocket.getTweetsForFile().subscribe((tweets) => {
      if (tweets.length === 0) {
        alert('No tweets are available to download');
      } else {
        this.tweetsInfo = tweets;
        this.generateFile();
      }
    });
  }

  ngOnInit(): void {
    this.getTweets();
    this.getFile();
  }

  ngOnDestroy(): void {
    this.connection.unsubscribe();
  }

}
