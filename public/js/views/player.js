// Main Playlist, split in A and B

var Player = Backbone.View.extend({

	el: '#player',

	events: {
		'click .play': 'play'
	},

	initialize: function() {
		this.$lists = [this.$el.find('.playListA ul'),
									 this.$el.find('.playListB ul')];
		this.currentTrack = null;
		this.songs = [];

		// this.render();
	},

	render: function() {
		var tracks = this.model.get('playlist');
		tracks.forEach(function(track) {
			var list = this.$lists[track.get('side')];
			var li = $('<li>');
			li.text(track.get('title'));
			list.append(li);
		}, this);
	},

	play: function(evt) {
		if (this.currentTrack) {
			currentTrack.play();
			return;
		}
		var self = this;
		$el = this.$el;
		$el.addClass('loading');

		var tracks = this.model.get('playlist');
		var left = tracks.length;

		tracks.forEach(function(track, i) {
				$.getJSON('/play/' + track.get('id'), function(data) {
					var sound = soundManager.createSound({
						id: track.get('id'),
						url: data.url,
						autoLoad: true,
						autoPlay: i === 0,
						whileloading: onprogress || function(){},
						onfinish: function() {
							console.log('finished playing: ' + i);
							$el.removeClass('playing');
							if (i + 1 < self.songs.length)
								self.songs[i + 1].play();
						},
						onpause: function() {
							$el.removeClass('playing');
						},
						onplay: function() {
							var list = self.$lists[track.get('side')];
							var el = list.find('li:nth-child(' + (i + 1) + ')').addClass('playing');
							console.log(el);

							console.log('playing: ' + i);
							//App.pushPlay(snd);
							$el.removeClass('loading').addClass('playing');
							//this.setPosition(29 * 1000);
						},
						onresume: function() {
							App.pushPlay(snd);
							$el.addClass('playing');
						},
						onstop: function() {
							$el.removeClass('playing');
						},
						onload: function() {
							console.log('loaded: ' + i);
							console.log('left: ' + left);
							left--;
							console.log('loaded all songs');
						}
					});
					self.songs.push(sound);
			});
		}, this);
	},
	pause: function() {

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