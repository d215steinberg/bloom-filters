(function () {
	var BitArray = require('./bitArray');
	var hasher = require('./hasher');
	var bitArray = new BitArray;

	module.exports.lookup = function (word) {
		return bitArray.getBit(hasher.getHash(word));
	};

	module.exports.setBit = function (bitNum) {
		bitArray.set(bitNum);
	};
})();
