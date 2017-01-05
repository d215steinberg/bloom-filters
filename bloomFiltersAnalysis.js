(function () {
	var randomWordGenerator = require('./randomWordGenerator');
	var binaryDictionary = require('./binaryDictionary');
	var bloomFilters = require('./bloomFilters');

	module.exports.FALSE_POSITIVE_LABEL = "False positive: ";

	function logFalsePositive(word) {
		if (bloomFilters.lookup(word)) {
			if (!binaryDictionary.lookup(word)) {
				console.log(module.exports.FALSE_POSITIVE_LABEL + word + '\n');
			}
		}
	}

	module.exports.analyze = function (numWords) {
		for (i = 0; i < numWords; i++) {
			var word = randomWordGenerator.generate();
			logFalsePositive(word);
		}
	};
})();
