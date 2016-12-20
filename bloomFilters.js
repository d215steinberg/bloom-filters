(function () {
	var BitSet = require('bitset.js');
	var hasher = require('./hasher');
	var bitSet = new BitSet;

	module.exports.lookup = function (word) {
		return bitSet.get(hasher.getHash(word));
	};

	module.exports.setBit = function (bitNum) {
		bitSet.set(bitNum);
	};
})();
