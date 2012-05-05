// Main Playlist, split in A and B

var Search = Backbone.View.extend({

	el: '#search',

	events: {
		'change': 'search'
	},

	initialize: function() {
		this.$input = this.$el.find('input');
		this.$list = this.$el.find('.playlist');
		this.collection = new SearchTracks();
		this.collection.bind('reset', this.render, this);
	},

	render: function() {
		var list = this.$list;
		list.empty();
		this.collection.forEach(function(track) {
			var view = new TrackEntry({model: track});
			view.render();
			list.append(view.$el);
		});
	},

	search: function(evt) {
		var self = this;
		function done() {
			self.$el.removeClass('loading');
		}
		var needle = this.$input.val();
		self.$el.addClass('loading');
		console.log('new search for: ' + needle);
		if (needle == '') {
			done();
			self.collection.reset();
			return;
		}
		$.getJSON('/search/' + encodeURI(needle), function(data) {
			console.log('got search back');
			self.collection.reset(data);
			done();
		});
	}

});