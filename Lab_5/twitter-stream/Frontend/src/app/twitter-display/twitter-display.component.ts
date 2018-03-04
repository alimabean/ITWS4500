import { Component, OnInit, OnDestroy } from '@angular/core'
import { WebSocketService } from '../web-socket.service'
import { trigger, animate, transition, state, style } from '@angular/animations'

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
export class TwitterDisplayComponent implements OnInit {
	tweets: String[] = []
	location: String
	location_placeholder: String = "Longitude | Latitude"
	count_placeholder: String = "Tweet count"
	count: String
	connection

  constructor(private webSocket:WebSocketService) { }

  sendLocation() {
  	this.webSocket.sendLocation(this.location, this.count)
  	this.location = ''
  	this.count = ''
  }

  clearTweets() {
  	this.tweets = []
  }

  ngOnInit() {
  	this.connection = this.webSocket.getTweets().subscribe(tweets => {
  		(<any>tweets).forEach(tweet => {
  			this.tweets.push(tweet)
  		})
  	})
  }

  ngOnDestroy() {
  	this.connection.unsubscribe()
  }

}
