(function() {
	var darkSkyAppStringHash = require('string-hash');
	var djb2ishHash = function (word) {
		return Math.floor(darkSkyAppStringHash(word) / 8);
	};

	var crypto = require('crypto');
	function getNumericHashFromCrypto(word, algorithm) {
		var hash = crypto.createHash(algorithm).update(word).digest("hex");
		var last7Digits = hash.substr(hash.length - 7);
		return parseInt(last7Digits, 16);
	}

	var sha1Hash = function(word) {
		return getNumericHashFromCrypto(word, 'sha1');
	};

	var md5Hash = function(word) {
		return getNumericHashFromCrypto(word, 'md5');
	};

	var sha256Hash = function(word) {
		return getNumericHashFromCrypto(word, 'sha256');
	};

	var javaHashAlgorithm = require('./javaHashAlgorithm');
	var javaHash = function(word){
		return Math.floor(Math.abs(javaHashAlgorithm(word)) / 4);
	};

	var hashFunctions = [djb2ishHash, sha1Hash, md5Hash, sha256Hash, javaHash];

	module.exports.NUM_HASHES = hashFunctions.length;

	module.exports.getHash = function (word, hashNum) {
		return hashFunctions[hashNum - 1](word);
	};
})();

