
(function(undefined) {

var App = Backbone.Router.extend({

	routes: {
		'': 'editor', // matches http://example.com/#anything-here
		'search': 'search',
		'player': 'player'
	},

	initialize: function() {

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


		// Views

		this.currentView = null;

		this.loginView = new Login();
		this.editorView = new Editor();
		this.searchView = new Search();
		this.playerView = new Player();

		this.loginView.$el.hide();
		this.editorView.$el.hide();
		this.searchView.$el.hide();

		this.container = $('#main');

		Backbone.history.start({pushState: true});

	},

	changeView: function(to) {

		if (this.currentView) {
			this.currentView.$el.hide();
		}

		to.render(this.container);

		to.$el.fadeIn();
		to.$el.show();

		this.currentView = to;
	},

	login: function() {

		this.changeView(this.loginView);

	},

	search: function() {

		this.changeView(this.searchView);

	},

	editor: function() {

		this.changeView(this.editorView);

	},

	player: function() {

		this.changeView(this.playerView);

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

	pushPlay: function(snd) {
		if (this.snd) {
			this.snd.stop();
		}
		this.snd = snd;
	}

});

this.App = new App();

}).call(this);

