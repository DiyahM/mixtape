
var Login = Backbone.View.extend({

	el: '#login',

	events: {
		'click #btn-login': 'login'
	},

	initialize: function() {

		this.$el.hide();

	},

	render: function() {

		console.log(this.$el);

	},

	login: function(evt) {

		FB.login(function() {

		});

	}

});

var TrackPlayer = Backbone.View.extend({

	tagName: 'span',

	template: null, // load jQuery template

	events: {
		click: this.click
	},

	initialize: function() {

		_.bindAll(this, 'click');

	},

	render: function() {

		$(this.el).html(this.template({
			// data from this.model
		}));

	},

	click: function(evt) {

		$(this.el).addClass('loading');

		// Loading state?
		this.model.getSoundMgr(function(snd) {
			snd.play();
		});

	}

});

// Main Playlist, split in A and B

var Editor = Backbone.View.extend({

	el: '#mixtape',

	events: {
		'click .add': 'addTrack'
	},

	collection: MixtapeTracks,

	initialize: function() {

		this.$el.hide();

	},

	render: function() {

		// TODO: Fill playlist
		$(this.el).find('ul')

	},

	addTrack: function(evt) {

	}

});


// Main Playlist, split in A and B

var Search = Backbone.View.extend({

	el: '#search',

	events: {
		'click .add': 'addTrack'
	},

	collection: MixtapeTracks,

	initialize: function() {

		this.$el.hide();

	},

	render: function() {

		// TODO: Fill playlist
		$(this.el).find('ul')

	},

	addTrack: function(evt) {

	}

});