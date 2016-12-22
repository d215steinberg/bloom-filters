(function () {
	var BitSet = require('bitset.js');

	module.exports = function() {
		var bitSet = new BitSet;

		return {
			setBit: function(bitNum) {
				bitSet.set(bitNum);
			},

			getBit: function(bitNum) {
				return bitSet.get(bitNum);
			}
		}
	};
})();
