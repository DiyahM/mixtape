
(function(undefined) {


var App = {

	ready: function() {

		// Can't disable flash?!
		soundManager.url = null;
		soundManager.preferFlash = false;

		window.fbAsyncInit = App.readyFb;

		(function(d){
			 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement('script'); js.id = id; js.async = true;
			 js.src = "//connect.facebook.net/en_US/all.js";
			 ref.parentNode.insertBefore(js, ref);
		 }(document));

	},

	readyFb: function() {

		FB.init({
			appId: env.FB_ID,
			channelUrl: '//channel',
			status: true,
			cookie: true // enable cookies to allow the server to access the session
		});

		$(document.body).addClass('fb-loaded');

	},

	play: function(id) {

		jQuery.getJSON('/play/' + id, function(data) {

			var url = data.url;
			if (soundManager.canPlayURL(url)) {
			 soundManager.createSound('fooSound', sURL);
			}

		});

	}

};

App.ready();

}).call(this);

