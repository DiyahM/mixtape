
(function(undefined) {

var Application = Backbone.Router.extend({

	routes: {
		'': 'editor', // matches http://example.com/#anything-here
		'search': 'search',
		'player': 'player',
		'publish': 'publish'
	},

	initialize: function() {

		_(this).defaults(Backbone.Events);
		this._callbacks = null;
		this.subscribe = Backbone.Events.on;
		this.unsubscribe = Backbone.Events.off;
		this.publish = Backbone.Events.trigger;


		// Can't disable flash?!
		soundManager.url = null;
		soundManager.preferFlash = false;

		window.fbAsyncInit = function() {

			FB.Event.subscribe('auth.login', function(response) {
				App.subscribe('login');
			});

			FB.init({
				appId: env.FB_ID,
				channelUrl: '/channel',
				status: true,
				cookie: true // enable cookies to allow the server to access the session
			});

			$(document.body).addClass('fb-loaded');

		};

		(function(d){
			var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
			if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js";
			ref.parentNode.insertBefore(js, ref);
		 }(document));


		// Views

		this.currentView = null;

		this.publishView = new Publish();
		this.editorView = new Editor();
		this.searchView = new Search();
		this.playerView = new Player({model: new MixedTape({
				to: 'to',
				from: 'from',
				title: 'title',
				playlist: [
					{
						id: 3766427,
						title: 'a',
						side: 0
					},
					{
						id: 3631755,
						title: 'b',
						side: 1
					}
				]
			})
		});

		this.editorView.$el.hide();
		this.searchView.$el.hide();
		this.publishView.$el.hide();

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

		if (to.focus) {
			to.focus();
		}

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

	publish: function() {

		this.changeView(this.publishView);

	},

	player: function() {

		this.changeView(this.playerView);

	},

	pushPlay: function(snd) {
		if (this.snd) {
			this.snd.stop();
		}
		this.snd = snd;
	}

});

window.App = new Application();

}).call(this);

