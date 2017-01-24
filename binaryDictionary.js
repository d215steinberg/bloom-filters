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
		var numWords = wordList.length;

		if (numWords === 0) {
			return false;
		}
		if (numWords === 1) {
			return wordList[0] === word;
		}

		var middlePosition = Math.floor(numWords / 2);
		return wordList[middlePosition] === word
			|| lookup(wordList.slice(0, middlePosition), word)
			|| lookup(wordList.slice(middlePosition, numWords), word);
	}

	module.exports.lookup = function (word) {
		return lookup(words, word);
	};
})();
