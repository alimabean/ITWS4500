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

  sendLocation(): void {
    this.webSocket.sendLocation(this.location, this.count);
    this.location = '';
    this.count = '';
  }

  clearTweets(): void {
    this.tweets = [];
  }

  parseTweet(tweet): void {
    this.tweets.push([tweet[5], tweet[2]]);
  }

  getTweets(): void {
    this.connection = this.webSocket.getTweets().subscribe(tweets => {
      this.tweetsInfo = <any>tweets;
      (<any>tweets).forEach(tweet => {
        this.parseTweet(tweet);
      });
    });
  }

  generateJson(): string {
    let json = '{';
    console.log(this.tweetsInfo);
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
    json += '}';
    return json;
  }

  generateCsv(): string {
    let csvContent = '"created_at","id","text","user_id","user_name","user_screen_name",' +
      '"user_location","user_followers_count","user_friends_count","user_created_at",' +
      '"user_time_zone","user_profile_background_color","user_profile_image_url","geo","coordinates","place"\r\n';
    (this.tweetsInfo).forEach(row => {
      row = row.map(item => item === null ? 'null' : item);
      console.log(row);
      csvContent += row.join(',') + '\r\n';
    });
    return csvContent;
  }

  generateFile() {

    const file = new Blob([this.selected === 'json' ?
      this.generateJson() : this.generateCsv()], {
      type: `text/${this.selected}`,
    });
    saveAs(file, `limaa-tweets.${this.selected}`);
  }

  getFile(): void {
    if (this.tweetsInfo.length === 0) {
      alert('No tweets are available to download');
    } else {
      this.generateFile();
    }
  }

  ngOnInit() {
    this.getTweets();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
