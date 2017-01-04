(function () {
	var randomWordGenerator = require('./randomWordGenerator');
	var binaryDictionary = require('./binaryDictionary');
	var bloomFilters = require('./bloomFilters');

	module.exports.analyze = function () {
		var word = randomWordGenerator.generate();
		if(!bloomFilters.lookup(word)) {
			return;
		}
		if (!binaryDictionary.lookup(word)) {
			console.log(word);
		}
	};
})();
