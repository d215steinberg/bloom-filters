(function() {
	var darkSkyAppStringHash = require('string-hash');
	var djb2ish = function (word) {
		return Math.floor(darkSkyAppStringHash(word) / 8);
	};
	
	var hashFunctions = [djb2ish];

	module.exports.NUM_HASHES = hashFunctions.length;

	module.exports.getHash = function (word, hashNum) {
		return hashFunctions[hashNum - 1](word);
	};
})();

