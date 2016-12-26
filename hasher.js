(function() {
	var darkSkyAppStringHash = require('string-hash');
	var djb2ish = function (word) {
		return Math.floor(darkSkyAppStringHash(word) / 8);
	};

	var crypto = require('crypto');
	var sha1Hash = function(word) {
		var hash = crypto.createHash('sha1').update(word).digest("hex");
		var last7Digits = hash.substr(hash.length - 7);
		return parseInt(last7Digits, 16);
	};

	var md5Hash = function(word) {
		var hash = crypto.createHash('md5').update(word).digest("hex");
		var last7Digits = hash.substr(hash.length - 7);
		return parseInt(last7Digits, 16);
	};

	var sha256Hash = function(word) {
		var hash = crypto.createHash('sha256').update(word).digest("hex");
		var last7Digits = hash.substr(hash.length - 7);
		return parseInt(last7Digits, 16);
	};

	var hashFunctions = [djb2ish, sha1Hash, md5Hash, sha256Hash];

	module.exports.NUM_HASHES = hashFunctions.length;

	module.exports.getHash = function (word, hashNum) {
		return hashFunctions[hashNum - 1](word);
	};
})();

