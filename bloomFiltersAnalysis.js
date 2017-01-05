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

		function isPositive(word) {
			return bloomFilters.lookup(word);
		}

		function isFalsePositive(word) {
			return !binaryDictionary.lookup(word);
		}

		function getFalsePositivePercentage() {
			if (positiveCount === 0) {
				return "N/A";
			}
			return Math.round((falsePositiveCount / positiveCount) * 100) + "%";
		}

		function logFalsePositive(word) {
			console.log(module.exports.FALSE_POSITIVE_LABEL + word);
		}

		function logFalsePositiveCount() {
			console.log(module.exports.NUMBER_OF_FALSE_POSITIVES_LABEL + falsePositiveCount);
		}

		function logFalsePositivePercentage() {
			console.log(module.exports.PERCENTAGE_OF_FALSE_POSITIVES_LABEL + getFalsePositivePercentage());
		}

		function analyzePositive(word) {
			positiveCount++;
			if (isFalsePositive(word)) {
				logFalsePositive(word);
				falsePositiveCount++;
			}
		}

		function analyzeWord(word) {
			if (isPositive(word)) {
				analyzePositive(word);
			}
		}

		for (var i = 0; i < numWords; i++) {
			analyzeWord(randomWordGenerator.generate());
		}
		logFalsePositiveCount();
		logFalsePositivePercentage();
	};
})();
