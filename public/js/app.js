
(function(undefined) {

var App = {

	ready: function() {

	},

	play: function(id) {

		jQuery.getJSON('/play/' + id, function(data) {

			var url = data.url;
			if (soundManager.canPlayURL(url)) {
			 soundManager.createSound('fooSound', sURL);
			}

		});

	}

}

App.ready();

}).call(this);

