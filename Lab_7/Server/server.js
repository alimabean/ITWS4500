const express = require('express');
const http = require('http').Server(express());
const io = require('socket.io')(http);
const twitter = require('twitter');
const fs = require('fs');
const csv = require('csv-write-stream');
const writer = csv({ headers: ["tweet"]});
const service = require('./service');

var client = new twitter({
	// Enter your twitter api keys
  // consumer_key: process.env.TWITTER_CONSUMER_KEY,
  // consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  // access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  // access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  consumer_key: '5ZFgKXiSppCfKboEl4PoUnVSy',
  consumer_secret: '82g2001d91Evuj49jrz6jFOL1M0io1555oDqHpDqqvO2SMjzZy',
  access_token_key: '969357938354769925-P1roRZsVnnlNmU6mBH4z5keIDBCkXot',
  access_token_secret: 'tpgHiC9VSdabY5TtfSofYgOOk9ZG1A7hSZSFoinAA0q9v'
});

// Resolve GET Request
async function makeGet(coords, count) {
	return await getTweets('search/tweets', {
		q: 'rpi',
		geocode: `${coords[0]},${coords[1]},1km`,
		result_type:'recent',
		count: count});
}

// Write tweets to a local json file
function writeTweets(tweets, type) {
  parsed = parseTweets(tweets);
	if (type == 'json') {
		fs.writeFile('limaa-tweets.json', JSON.stringify(parsed), function(err) {
			if (err) {
				return console.log(err);
			}
		})
	}
	else {
		writer.pipe(fs.createWriteStream('limaa-tweets.csv'))
    parsed.forEach(tweet => {
      writer.write([tweet]);
    });
    // writer.end()
	}
}

// Return Promise of GET Request to Twitter API
function getTweets(endpoint, params) {
	return new Promise((resolve, reject) => {
		client.get(endpoint, params, (error, data, response) => {
			if (error) reject(error);
			else {
				writeTweets(data, 'csv');
				resolve(data);
			}
		})
	})
}

function archiveTweets(tweets) {
	tweets.forEach((tweet) => {
		service.addTweet(tweet);
	});
}

// Scrub the json for the tweet text
function parseTweets(json) {
	data = json['statuses'].filter(tweet => tweet['text']).map(tweet => 
    [tweet['created_at'], tweet['id'], tweet['text'],
      tweet['user']['id'], tweet['user']['name'], tweet['user']['screen_name'], 
      tweet['user']['location'], tweet['user']['followers_count'], 
      tweet['user']['created_at'], tweet['user']['time_zone'], 
      tweet['user']['profile_background_color'], tweet['user']['profile_image_url'],
      tweet['geo'], tweet['coordinates'], tweet['place']['id']
    ] 
	);
	archiveTweets(data);
	return data;
}

function deleteAllTweets() {
	service.deleteAllTweets();
}

async function getTweetsFromDb(query) {
	console.log('fetching tweets from DB');
	return await service.findAllTweets();
}

// Handle front end calls
io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});

	socket.on('location', async (query) => {
		location = query[0] ? query[0].split(' ') : ['42.728412','-73.691785'];
		count = query[1] ? query[1] : '10';
		const tweets = await makeGet(location, count);
		// Send tweets only to the requesting user
		socket.emit('tweets', parseTweets(tweets));
	});
	
	socket.on('requestTweets', async (query) => {
		socket.emit('tweetsFile', await getTweetsFromDb());
	});

  socket.on('file', async (fileType) => {
    console.log(fileType);
	});
	
	socket.on('deleteAll', () => {
		deleteAllTweets();
	});

})

http.listen(5000, () => {
	console.log('Server started on port 5000');
})