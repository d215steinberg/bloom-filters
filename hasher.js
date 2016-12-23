var darkSkyAppStringHash = require('string-hash');
var hashFunctions = [darkSkyAppStringHash];

module.exports.NUM_HASHES = hashFunctions.length;

module.exports.getHash = function(word, hashNum){
	return Math.floor(hashFunctions[hashNum - 1](word) / 8);
};

