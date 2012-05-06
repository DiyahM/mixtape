
// Main Playlist, split in A and B

var Editor = Backbone.View.extend({

	el: '#mixtape',

	events: {
		'click .search': 'routeSearch',
		'click .publish': 'publish'
	},

	model: new MixedTape(),

	collection: new MixtapeTracks(),

	initialize: function() {

		_.bindAll(this);

		this.collection.bind('add', this.add, this);
		this.collection.bind('change', this.render, this);

		this.$list = this.$el.find('.playlist');

	},

	render: function() {

		this.$list.html('');

		var self = this;

		this.collection.each(function(track) {

			var view = new TrackEntry({model: track});
			view.render();

			self.$list.append(view.$el);

		});


	},

	add: function(track) {

		this.render()

	},

	routeSearch: function(evt) {

		App.navigate('search', {trigger: true});

	},

	publish: function() {

		var login = function(response) {

			if (response.status === 'connected') {
				var uid = response.authResponse.userID;
				var accessToken = response.authResponse.accessToken;

				App.user = {
					uid: uid,
					accessToken: accessToken
				};

				console.log('PUBLISH!');

				App.navigate('publish', {trigger: true});

			} else if (response.status === 'not_authorized') {
				alert('Sorry, you need to authenticate!')
			} else {
				alert('Sorry, try again!')
			}
		};

		FB.getLoginStatus(function(response) {

			if (response.status === 'connected') {

				login(response);

			} else {

				FB.login(function() {
					FB.getLoginStatus(function(response) {

						login(response);

					});
				});

			}

		});

	}

});