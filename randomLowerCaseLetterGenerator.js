(function () {
	var _ = require('underscore');

	module.exports.generate = function() {
		return String.fromCharCode(_.random(97, 122));
	};
})();