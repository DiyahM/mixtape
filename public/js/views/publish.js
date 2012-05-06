
var Publish = Backbone.View.extend({

	el: '#publish',

	events: {
		'submit #sms-form': 'sendSMS',
		'click #faces li': 'sendFacebook'
	},

	initialize: function() {

		this.$input = this.$el.find('#sms-form input');
		this.$faces = this.$el.find('#faces');

		self.friends = []

	},

	focus: function() {
		var self = this;

		if (window.FB) {
			FB.api('/me/friends?fields=id,name,picture', function(response) {

				self.friends = response.data;

			  self.render();
			});
		} else {
			setTimeout(function() {
				App.navigate('', {trigger: true});
			}, 100);

		}

	},

	render: function(container) {

		$faces = this.$faces.html('');

		_.each(this.friends, function(friend) {
			$faces.append($('<li id="friend-' + friend.id + '"><img src="' + friend.picture + '"/><div>' + friend.name + '</div></li>'));
		});

	},

	sendSMS: function(evt) {

		jQuery.post('/send', {
			sms: this.$input.val()
		});

	},

	sendFacebook: function(evt) {

		var li = $(evt.currentTarget.id);
		var id = li.attr('id').match(/\d/g)[0];

		var name = li.find('div').text();

		alert(name);
		alert(id);

		// jQuery.post('/send', {
		//	sms: this.$input.val()
		// });


	}

});
