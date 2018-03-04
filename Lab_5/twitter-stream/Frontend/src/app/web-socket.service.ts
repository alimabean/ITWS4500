import { Injectable } from '@angular/core'

import * as io from 'socket.io-client'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
 
@Injectable()
export class WebSocketService {
	private url = 'http://localhost:5000'
	private socket

  constructor() { }

  sendLocation(location, count) {
  	this.socket.emit('location', [location, count])
  }

  getTweets() {
  	let observable = new Observable(observer => {
  		this.socket = io(this.url)
  		this.socket.on('tweets', tweets => {
  			observer.next(tweets)
  		})
  		return () => {
  			this.socket.disconnect()
  		}
  	})
  	return observable
  }

}
