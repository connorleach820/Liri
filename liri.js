var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;

var spotify = new Spotify({
	id: "5f4bd00db4ff46b0b052255c6bcacc6c",
	secret: "4a4bfb2479fa467a95104b84505a97bb"
});

//console.log("To start, type my-tweets, spotify-this song, movie-this, or do-what-it-says!");

var firstCommand = process.argv[2];
var secondCommand = process.argv[3];

var twitterParams = { 
	screen_name: "leachc820"
} && {
	count: 20
};

function getTweets() {
	var client = new Twitter(keys.twitterKeys);

	var twitterParams = { 
		screen_name: "leachc820"
	} && {
		count: 20
	};

	client.get("statuses/user_timeline", twitterParams, function(error, tweets, response) {
		if (!error) {
			var data = [];
			for (var i = 0; i < tweets.length; i++) {
				data.push({
					"Date created: " : tweets[i].date_created,
					"Tweets: " : tweets[i].txt,
				});
			}
			console.log(data);
		}
	});
};

var findArtists = function(artist) {
	return artist.name;
};

var getSongs = function(songName) {
	if (songName === undefined) {
		songName = "The Sign"
	};

	spotify.search({type: "track", query: songName}, function(error, data) {
		if (!error) {
			console.log("Something's wrong: " + error);
			return;
		}
		var songs = data.tracks.items;
		var sData = [];

		for (var i = 0; i < songs.length; i++) {
			sData.push({
				"artist: " : songs[i].artists.map(findArtists),
				"song name: " : songs[i].name,
				"preview song: " : songs[i].preview_url,
				"album name: " : songs[i].album.name
			});
		} 
		console.log(sData);
	});
};

var getMovie = function(movieName) {
	if (movieName === undefined) {
		movieName = "Mr. Nobody";
	}

	var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

	request(movieUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var mData = [];
			var jsonData = JSON.parse(body);

			mData.push({
				"Title: " : jsonData.Title,
     		    "Year: " : jsonData.Year,
      			"IMDB Rating: " : jsonData.imdbRating,
      			"Country: " : jsonData.Country,
      			"Language: " : jsonData.Language,
      			"Plot: " : jsonData.Plot,
      			"Actors: " : jsonData.Actors,
      			"Rotten Tomatoes Rating: " : jsonData.tomatoRating
			});
			console.log(mData);
		}
	});
}

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var pick = function(caseData, functionData) {
  switch (caseData) {
    case "my-tweets":
      getTweets();
      break;
    case "spotify-this-song":
      getSongs(functionData);
      break;
    case "movie-this":
      getMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
  }
}

var runThis = function(argumentOne, argumentTwo) {
  pick(argumentOne, argumentTwo);
};

runThis(firstCommand, secondCommand);