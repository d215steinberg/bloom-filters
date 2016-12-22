(function () {
	var bitArray = require('./bitArray');
	var hasher = require('./hasher');

	function isHashAMiss(word, hashNum) {
		return bitArray.getBit(hasher.getHash(word, hashNum)) != 1;
	}

	module.exports.lookup = function (word) {
		for (var hashNum = 1; hashNum <= hasher.NUM_HASHES; hashNum++) {
			if (isHashAMiss(word, hashNum)) {
				return false;
			}
		}
		return true;
	};

	module.exports.setBit = function (bitNum) {
		bitArray.set(bitNum);
	};
})();
