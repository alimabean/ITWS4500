const express = require('express')
const http = require('http').Server(express())
const io = require('socket.io')(http)
const twitter = require('twitter')
const fs = require('fs')

var client = new twitter({
	// Enter your twitter api keys
  // consumer_key: process.env.TWITTER_CONSUMER_KEY,
  // consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  // access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  consumer_key: 'ewZZKdHo3cePYLsRJYX64gkGD',
  consumer_secret: '21ekNlz6tRvkew1birdAlUmHfcrm8wVNNBQZogpuQJtIWkwuVe',
  access_token_key:'969357938354769925-P1roRZsVnnlNmU6mBH4z5keIDBCkXot',
  access_token_secret: 'tpgHiC9VSdabY5TtfSofYgOOk9ZG1A7hSZSFoinAA0q9v'
})

// Resolve GET Request
function makeGet(coords, count) {
	return getTweets('search/tweets', {
		q: 'rpi',
		geocode: `${coords[0]},${coords[1]},1km`,
		result_type:'recent',
		count: count
	}).then(data => {
		return data
	})
}

// Write tweets to a local json file
function writeTweets(tweets) {
	fs.writeFile('limaa-tweets.json', JSON.stringify(tweets), function(err) {
		if (err) {
			return console.log(err)
		}
	})
}

// Return Promise of GET Request to Twitter API
function getTweets(endpoint, params) {
	return new Promise((resolve, reject) => {
		client.get(endpoint, params, (error, data, response) => {
			if (error) reject(error)
			else {
				writeTweets(data)
				resolve(data)
			}
		})
	})
}

// Scrub the json for the tweet text
function parseTweets(json) {
	data = json['statuses'].filter(tweet => tweet['text']).map(tweet => tweet['text'])
	console.log(data)
	return data
}

// Handle front end calls
io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('disconnect', () => {
		console.log('a user disconnected')
	})

	socket.on('location', async (query) => {
		console.log('Requested location' + query[0])
		location = query[0] ? query[0].split(' ') : ['42.728412','-73.691785']
		count = query[1] ? query[1] : '10'
		console.log(location)
		const tweets = await makeGet(location, count)
		// Send tweets only to the requesting user
		socket.emit('tweets', parseTweets(tweets))
	})
})

http.listen(5000, () => {
	console.log('Server started on port 5000')
})