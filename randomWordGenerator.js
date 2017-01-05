(function () {
	var randomLowerCaseLetterGenerator = require('./randomLowerCaseLetterGenerator');

	module.exports.generate = function() {
		var word = "";
		for (var i = 0; i < 5; i++) {
			word += randomLowerCaseLetterGenerator.generate();
		}

		return word;
	};
})();