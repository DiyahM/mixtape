// Main Playlist, split in A and B

var Player = Backbone.View.extend({

	el: '#player',

	initialize: function() {
		this.$listA = this.$el.find('.playListA ul');
		this.$listB = this.$el.find('.playListB ul');
		this.model = new MixedTape({
			to: 'to',
			from: 'from',
			title: 'title',
			playlist: [
				{
					title: 'song title',
					side: 0
				}
			]
		});
		this.render();
	},

	render: function() {
		var tracks = this.model.get('playlist');
		tracks.forEach(function(track) {
			var list = this.$listA;
			if (track.get('side') == 1)
				list = this.$listB;
			var li = $('li');
			console.log(list);
			li.text(track.get('title'));
			list.append(li);
		}, this);
	},

	open: function(evt) {
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