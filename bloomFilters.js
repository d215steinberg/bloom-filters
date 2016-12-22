(function () {
	var bitArray = require('./bitArray');
	var hasher = require('./hasher');

	module.exports.lookup = function (word) {
		for (var hashNum = 1; hashNum <= hasher.NUM_HASHES; hashNum++) {
			if (bitArray.getBit(hasher.getHash(word, hashNum)) != 1) {
				return false;
			}
		}
		return true;
	};

	module.exports.setBit = function (bitNum) {
		bitArray.set(bitNum);
	};
})();
