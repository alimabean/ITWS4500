Lab 5: Twitter Stream

Frontend: Angular + Angular animations
	- I decided against using jQuery for this lab and opted to use the angular animations package since it integrates nicely with an angular 2 project

	Most code can be found in the twitter-display folder as well as the web-socket.service.ts file

	twitter-display: houses the component for the twitter display card and logic for extracting user queries

	web-socket.service: handles communications with backend via socket.io

Backend:
	server.js: Express and Socket.io: 
		- used to pull tweets from the twitter api using the `node-twitter` package
		- handles incoming requests with sockets

	get requests are handled as async promises that are then emitted to the requesting connection

	once tweets are loaded, a call to writeTweets() is made to log the tweets to a local file

Per the lab requirements:
	- tweets are defaulted to the rpi area if a location is not specified
	- tweet count is defaulted to 10 if none is specified

Future work:
	- error handling for incorrect longitude + latitude queries
	- error handling for incorrect tweet count
