
var TrackEntry = Backbone.View.extend({

	events: {
		'click': 'add',
		'click .play': 'play'
	},

	tagName: 'li',

	template: _.template('<strong><%= title %></strong><%= artist %><small class="duration"><%= duration %></small><button class="play">Play</button>'), // load jQuery template

	initialize: function() {

	},

	render: function(search) {

		this.$el.html(this.template(this.model.toJSON()));

	},

	play: function(evt) {

		evt.stopImmediatePropagation();

		var self = this;

		// Loading state?
		this.model.getSoundMgr(this.$el, function(snd) {

			if (snd) snd.play();

		});

	},

	add: function(evt) {

		evt.stopImmediatePropagation();

		if (this.collection == App.editorView.collection) {
			return;
		}

		App.navigate('', {trigger: true});

		App.editorView.collection.add(this.model);
		App.searchView.reset();
	}

});
