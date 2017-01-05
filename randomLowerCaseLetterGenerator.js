(function () {
	var _ = require('underscore');

	module.exports.ASCII_FOR_LOWERCASE_A = 97;
	module.exports.ASCII_FOR_LOWERCASE_Z = 122;

	module.exports.generate = function() {
		return String.fromCharCode(_.random(module.exports.ASCII_FOR_LOWERCASE_A, module.exports.ASCII_FOR_LOWERCASE_Z));
	};
})();