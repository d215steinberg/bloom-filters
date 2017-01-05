(function () {
	var randomWordGenerator = require('./randomWordGenerator');
	var binaryDictionary = require('./binaryDictionary');
	var bloomFilters = require('./bloomFilters');

	module.exports.FALSE_POSITIVE_LABEL = "False positive: ";
	module.exports.NUMBER_OF_FALSE_POSITIVES_LABEL = "Number of false positives: ";
	module.exports.PERCENTAGE_OF_FALSE_POSITIVES_LABEL = "Percentage of false positives: ";


	module.exports.analyze = function (numWords) {
		var positiveCount = 0;
		var falsePositiveCount = 0;

		function logFalsePositive(word) {
			if (bloomFilters.lookup(word)) {
				positiveCount++;
				if (!binaryDictionary.lookup(word)) {
					console.log(module.exports.FALSE_POSITIVE_LABEL + word);
					falsePositiveCount++;
				}
			}
		}

		function getFalsePositivePercentage() {
			var percentage = (falsePositiveCount / positiveCount) * 100;
			if (isNaN(percentage)) {
				return "N/A";
			}
			return Math.round(percentage) + "%";
		}

		for (var i = 0; i < numWords; i++) {
			var word = randomWordGenerator.generate();
			logFalsePositive(word);
		}

		console.log(module.exports.NUMBER_OF_FALSE_POSITIVES_LABEL + falsePositiveCount);
		console.log(module.exports.PERCENTAGE_OF_FALSE_POSITIVES_LABEL + getFalsePositivePercentage());
	};
})();
