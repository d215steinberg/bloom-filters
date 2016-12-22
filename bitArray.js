(function () {
	var BitSet = require('bitset.js');

	var BitArray = function() {
		var bitSet = new BitSet;

		return {
			setBit: function(bitNum) {
				bitSet.set(bitNum);
			},

			getBit: function(bitNum) {
				return bitSet.get(bitNum);
			},

			clear: function() {
				bitSet.clear();
			}
		}
	};
	
	module.exports = new BitArray;
})();
