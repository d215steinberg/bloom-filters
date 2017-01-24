(function () {
	var rp = require('request-promise');
	var _s = require('underscore.string');
	var q = require('q');
	var words;

	module.exports.getWords = function () {
		return words;
	};

	module.exports.loadDictionary = function (dictionarySource) {
		return rp(dictionarySource)
			.then(function (data) {
				words = _s.words(data);
			})
			.catch(function (error) {
				return q.reject(error);
			});
	};

	function lookup(wordList, word) {
		if (wordList.length === 0) {
			return false;
		}
		if (wordList.length === 1) {
			return wordList[0] === word;
		}

		var middlePosition = Math.floor(wordList.length / 2);
		return wordList[middlePosition] === word
			|| lookup(wordList.slice(0, middlePosition), word)
			|| lookup(wordList.slice(middlePosition, wordList.length), word);
	}

	module.exports.lookup = function (word) {
		return lookup(words, word);
	};
})();
