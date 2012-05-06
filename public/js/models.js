
// STUBS!

var Track = Backbone.Model.extend({

	getSoundMgr: function(cb) {
		var snd = this.get('snd');
		if (snd) {
			cb(snd);
			return;
		}

		// SndMgr.ready( SndMgr.createSound(… ( this.set('snd', snd); cb(snd) )) )
	}

});