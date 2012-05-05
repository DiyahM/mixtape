
// Main Playlist, split in A and B

var Editor = Backbone.View.extend({

	el: '#mixtape',

	events: {
		'click .search': 'routeSearch'
	},

	collection: new MixtapeTracks(),

	initialize: function() {

		_.bindAll(this, 'addTrack');

		this.collection.bind('add', this.add, this);
		this.collection.bind('reset', this.render, this);

		this.$list = this.$el.find('.playlist');

	},

	render: function() {

		// var model = new Track({id: 1, title: 'Track 1', artist});
		// this.collection.add(model);

	},

	add: function(track) {

		var view = new TrackEntry({model: track});
		view.render();

		this.$list.append(view.$el);

	},

	routeSearch: function(evt) {

		App.navigate('search', {trigger: true});

	},

	addTrack: function() {

		// this.render()

	}

});