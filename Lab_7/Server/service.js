const TWEET = require('./models').tweetModel;

module.exports.addTweet = (tweetMeta) => {
    let tweet = new TWEET;
    tweet.created_at = tweetMeta[0];
    tweet.id = tweetMeta[1];
    tweet.text = tweetMeta[2];
    tweet.user_id = tweetMeta[3];
    tweet.user_name = tweetMeta[4];
    tweet.user_screen_name = tweetMeta[5];
    tweet.user_followers_count = tweetMeta[6];
    tweet.user_location = tweetMeta[7];
    tweet.user_friends_count = tweetMeta[8];
    tweet.user_created_at = tweetMeta[9];
    tweet.time_zone = tweetMeta[10];
    tweet.user_profile_background_color = tweetMeta[11];
    tweet.user_profile_image_url = tweetMeta[12];
    tweet.geo = tweetMeta[13];
    tweet.coordinates = tweetMeta[14];
    tweet.place = tweetMeta[15];
    tweet.save((err) => {
        if (err) console.error(err);
        else {
            console.log('successfully added tweet');
        }
    });
}

module.exports.findTweetByUserId = async (userId) => {
    let tweets;
    await TWEET.find({ user_id : userId }, (err, docs) => {
        if (err) console.error(err);
        tweets = docs;
    });
    return tweets;
}

module.exports.findTweetByText = async (text) => {
    let tweets;
    await TWEET.find({ 
        text: { $regex: '.*' + title + '.*' }
    }, (err, docs) => {
        if (err) console.error(err);
        tweets = docs;
    });
    return tweets;
}

module.exports.findAllTweets = async () => {
    let tweets;
    await TWEET.find((err, docs) => {
        if (err) console.error(err);
        tweets = docs;
        console.log(tweets);
    });
    return tweets;
}

module.exports.deleteAllTweets = () => {
    TWEET.remove((err) => {
        if (err) console.error(err);
        else console.log('Successfully deleted all Tweets from DB');
    });
}