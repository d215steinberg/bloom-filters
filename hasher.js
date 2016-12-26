(function() {
	var darkSkyAppStringHash = require('string-hash');
	var djb2ish = function (word) {
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

	var javaHash = function(word){
		var hash = 0;
		if (word.length == 0) return hash;
		for (i = 0; i < word.length; i++) {
			char = word.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.floor(Math.abs(hash) / 4);
	};

	var hashFunctions = [djb2ish, sha1Hash, md5Hash, sha256Hash, javaHash];

	module.exports.NUM_HASHES = hashFunctions.length;

	module.exports.getHash = function (word, hashNum) {
		return hashFunctions[hashNum - 1](word);
	};
})();

