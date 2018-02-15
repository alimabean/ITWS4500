const texts = data.filter(
	tweet => tweet.text
).map(
	(tweet, index) => {
		let textNode = document.createElement("li")
		userHandle = document.createElement("span")
		userHandle.setAttribute("class", "handle")
		userHandle.innerHTML = tweet["user"]["screen_name"]
		textNode.appendChild(userHandle)
		textNode.setAttribute("id", "tweet")
		textNode.appendChild(document.createTextNode(tweet["text"]))
		// userPhoto = document.createElement("a")
		// userPhoto.setAttribute("class", "userPhoto")
		// userPhoto.setAttribute()
		return textNode
})

function displayTweets(tweets, interval) {
	setTimeout( function() {
		document.getElementById("tweets").innerHTML = ''
		for (let text of tweets) {
		 	document.getElementById("tweets").appendChild(text)
		}
	}, 3000 * interval)
}

function cycleTweets(tweets) {
	for (let i = 0; i < tweets.length - 5; i += 5) {
		displayTweets(tweets.slice(i, i + 5), i / 5)
	}
}

cycleTweets(texts)