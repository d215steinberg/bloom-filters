/* String Hash algorithm used by Java.  From http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash- */
(function() {
	module.exports = function(word) {
		var hash = 0;
		if (word.length == 0) return hash;
		for (i = 0; i < word.length; i++) {
			char = word.charCodeAt(i);
			hash = ((hash<<5)-hash)+char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	}
})();
