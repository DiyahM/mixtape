
var Login = Backbone.View.extend({

	el: '#login',

	events: {
		'click #btn-login': 'login'
	},

	initialize: function() {

	},

	render: function(container) {



	},

	login: function(evt) {

		FB.login(function() {

		});

	}

});
