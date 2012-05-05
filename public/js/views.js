
var Login = Backbone.View.extend({

	events: {
		'click #login': 'login'
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

var MixtapeList = Backbone.View.extend({

	el: $('mixpape-list'),

	events: {
		'click .add': 'addTrack'
	},

	collection: MixtapeTracks,

	initialize: function() {

		_.bindAll(this, 'click');

	},

	render: function() {

		// TODO: Fill playlist
		$(this.el).find('ul')

	},

	addTrack: function(evt) {

	}

});