(function () {
	var rp = require('request-promise');
	var _ = require('underscore');
	var _s = require('underscore.string');
	var bitArray = require('./bitArray');
	var hasher = require('./hasher');
	var q = require('q');

	function isHashAMiss(word, hashNum) {
		return bitArray.getBit(hasher.getHash(word, hashNum)) != 1;
	}

	module.exports.loadDictionary = function(dictionarySource) {
		return rp(dictionarySource)
			.then(function(data) {
				var words = _s.words(data, '\\n');
				_.each(words, function(word) {
					for (var hashNum = 1; hashNum <= hasher.NUM_HASHES; hashNum++) {
						bitArray.setBit(hasher.getHash(word, hashNum));
					}
				});
			})
			.catch(function(error) {
				return q.reject(error);
			});
	};

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
