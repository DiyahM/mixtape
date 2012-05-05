var async = require('async');
var express = require('express');
var util = require('util');
var jade = require('jade');
var stylus = require('stylus');
var nib = require('nib');
var echonest = require('echonest');
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

mongoose = require('mongoose');
// mongoose.connect(process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/app');

// Echonest

echonest = new echonest.Echonest({
    api_key: 'LOARVIOUAUEGXXL9L'
});

// 7digital

sdigital.configure({
	oauthkey: '7dsteshfbcps',
	oauthsecret: 'rwvhq87ghummdt8m'
});

// Configure express

app = module.exports = express.createServer();

app.configure(function() {

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

  // Stylus
  app.use(stylus.middleware({
    src: __dirname + '/views',
    dest: __dirname + '/public',
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


// create an express webserver
var app = express.createServer(
	express.logger(),
	express.static(__dirname + '/public'),
	express.bodyParser(),
	express.cookieParser(),

	// set this to a secret value to encrypt session cookies
	express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),

	require('faceplate').middleware({
		app_id: process.env.FACEBOOK_APP_ID,
		secret: process.env.FACEBOOK_SECRET,
		scope: 'user_likes,user_photos'
	})
);

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

app.get('/play', function play(req, res) {

	//

	tracks = new api.Tracks();

	tracks.getPreview({trackId: 'SOVAOIM1315CD48938'}, function(err, data) {

		console.log(data);

	});

});


app.post('/search', function play(req, res) {

	console.log(req.params);

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

	nest.song.search({
		combined: query,
		sort: 'song_hotttnesss-desc' // for better results, hits first
	}, function(err, data) {

		data = data.songs || [];

		data = data.map(function(song) {
			return {
				id: song.id,
				artist: song.artist_name,
				title: song.title
			};
		});

		cache.search[query] = data

		res.json(data);

	});


});


