(function () {
	var randomWordGenerator = require('./randomWordGenerator');
	var binaryDictionary = require('./binaryDictionary');
	var bloomFilters = require('./bloomFilters');

	module.exports.FALSE_POSITIVE_LABEL = "False positive: ";


	module.exports.analyze = function (numWords) {
		var falsePositiveCount = 0;

		function logFalsePositive(word) {
			if (bloomFilters.lookup(word)) {
				if (!binaryDictionary.lookup(word)) {
					console.log(module.exports.FALSE_POSITIVE_LABEL + word + '\n');
					falsePositiveCount++;
				}
			}
		}

		for (var i = 0; i < numWords; i++) {
			var word = randomWordGenerator.generate();
			logFalsePositive(word);
		}

		console.log("Number of false positives: " + falsePositiveCount + '\n');
	};
})();
