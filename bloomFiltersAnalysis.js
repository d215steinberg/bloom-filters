(function () {
	var randomWordGenerator = require('./randomWordGenerator');
	var binaryDictionary = require('./binaryDictionary');

	module.exports.analyze = function () {
		var word = randomWordGenerator.generate();
		if (!binaryDictionary.lookup(word)) {
			console.log(word);
		}
	};
})();
