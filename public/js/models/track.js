
var Track = Backbone.Model.extend({

	getSoundMgr: function($el, cb, onprogress) {
		var snd = this.get('snd');

		if (snd) {
			cb(snd);
			return;
		}

		var self = this;

		$el.addClass('loading');

		$.getJSON('/play/' + this.get('id'), function(data) {

			snd = soundManager.createSound({
				id: self.get('id'),
				url: data.url,
				whileloading: onprogress || function(){},
				onfinish: function() {
					$el.removeClass('playing');
				},
				onpause: function() {
					$el.removeClass('playing');
				},
				onplay: function() {
					App.pushPlay(snd);
					$el.removeClass('loading').addClass('playing');
				},
				onresume: function() {
					App.pushPlay(snd);
					$el.addClass('playing');
				},
				onstop: function() {
					$el.removeClass('playing');
				}
			});

			self.set('snd', snd);

			cb(snd);
		});

		// SndMgr.ready( SndMgr.createSound(… ( this.set('snd', snd); cb(snd) )) )
	}

});