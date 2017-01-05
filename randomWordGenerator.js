(function () {
	var randomLowerCaseLetterGenerator = require('./randomLowerCaseLetterGenerator');
	var WORD_LENGTH = 5;

	module.exports.generate = function () {
		var word = "";
		for (var i = 0; i < WORD_LENGTH; i++) {
			word += randomLowerCaseLetterGenerator.generate();
		}

		return word;
	};
})();