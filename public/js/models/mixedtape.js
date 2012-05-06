
var MixedTape = Backbone.Model.extend({

	initialize: function() {
		this.set('playlist', new PlayerTracks(this.get('playlist')));
	}

});