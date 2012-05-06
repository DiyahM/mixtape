var async = require('async');
var express = require('express');
var util = require('util');
var jade = require('jade');
var stylus = require('stylus');
var nib = require('nib');
var request = require('request');
var qs = require('querystring');
var sdigital = require('7digital-api');

// Redis

// if (process.env.REDISTOGO_URL) {
//	rtg = require('url').parse(process.env.REDISTOGO_URL);
//	redis = require('redis').createClient(rtg.port, rtg.hostname);
//	redis.auth(rtg.auth.split(':')[1]);
// } else {
//	redis = require('redis').createClient();
// }

// MongoDB

// mongoose = require('mongoose');
// mongoose.connect(process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/app');

// 7digital

sdigital.configure({
	oauthkey: process.env.SDIGITAL_KEY,
	oauthsecret: process.env.SDIGITAL_SECRET
});
var tracks = new sdigital.Tracks();


// Configure express

app = module.exports = express.createServer();

app.configure(function() {

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  // app.use(express.session({ secret: process.env.SESSION_SECRET || 'secret123' }));

  // Stylus
  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: function(str, path) {
      var compiler;
      compiler = stylus(str);
      compiler.set('filename', path);
      compiler.set('compress', false);
      compiler.use(nib());
      return compiler;
    }
  }, app.helpers({
    _: require('underscore')
  })));

  app.use(express.static(__dirname + '/public'));

});

app.configure('development', function() {

  app.set('view options', {
    pretty: true
  });
  app.use(express.static(__dirname + '/public', {
    maxAge: 31557600000
  }));

  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));

});

app.configure('production', function() {

  return app.use(express.errorHandler());

});


// In memory cache for fast search

var cache = {
	search: {}
};

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log('Listening on %d', port);
});


// Components

var index = function index(req, res) {

	res.render('index.jade', {
		title: 'Mixtape',
		env: {
			FB_ID: process.env.FB_ID
		}
	});

};

app.get('/', index);

app.get('/search', index);
app.get('/publish', index);
app.get('/player', index);
app.get('/mix/:id', index);

app.get('/play/:id', function play(req, res) {

	tracks.getPreview({trackId: req.params.id}, function(err, data) {

		var url = data.url || null;

		res.json({url: url});

	});

});


app.get('/search/:q', function search(req, res) {

	query = (req.params.q || '').trim();

	if (!query.length) {
		res.json([]);
		return;
	}

	var cachehit = cache.search[query] || null;
	if (cachehit) {
		res.json(cachehit);
		return
	}

	// 7digital track search API

	tracks.search({q: query}, function(err, data) {

		data = data.searchResults.searchResult || []; // JSON, XML style

		data = data.map(function(track) {

			track = track.track;

			// Nice duration
			var duration = track.duration;
			var seconds = String(duration % 60);
			while (seconds.length < 2) {
				seconds += '0'
			}
			duration = Math.round(duration / 60) + ':' + seconds

			return {
				id: track.id,
				artist: track.artist.name,
				title: track.title,
				duration: duration,
				url: track.url,
				image: track.release.image || null
			};
		});

		cache.search[query] = data;

		res.json(data);

	});

	// nest.song.search({
	//	combined: query,
	//	sort: 'song_hotttnesss-desc' // for better results, hits first
	// }, function(err, data) {

	//	data = data.songs || [];

	//	data = data.map(function(song) {
	//		return {
	//			id: song.id,
	//			artist: song.artist_name,
	//			title: song.title
	//		};
	//	});

	//	cache.search[query] = data

	//	res.json(data);

	// });


});


app.post('/sms', function search(req, res) {

	var sms = req.params.sms;

	var body = qs.stringify({
		client_id: process.env.ATNT_ID,
		client_secret: process.env.ATNT_SECRET,
		grant_type: 'client_credentials',
		scope: 'SMS'
	});

	console.log(body);

	request.post({
		url: 'https://api.att.com/oauth/token',
		body: body
	}, function(err, r, data) {
		console.log(r, data);
	});

});

app.get('/channel', function(req, res) {

	res.setHeader('Cache-Control', 'public, max-age=' + (31557600000 / 1000)); // 1y
	res.send('<script src="//connect.facebook.net/en_US/all.js"></script>');

});


