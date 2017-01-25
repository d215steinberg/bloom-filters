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

		var middlePosition = Math.floor(numWords / 2);
		if (numWords === 0) {
			return false;
		}
		if (numWords === 1) {
			return wordList[0] === word;
		}

		function wordIsInMiddle() {
			return wordList[middlePosition] === word;
		}

		function wordIsInFirstHalf() {
			return lookup(wordList.slice(0, middlePosition), word);
		}

		function wordIsInSecondHalf() {
			return lookup(wordList.slice(middlePosition, numWords), word);
		}

		return wordIsInMiddle()
			|| wordIsInFirstHalf()
			|| wordIsInSecondHalf();
	}

	module.exports.lookup = function (word) {
		return lookup(words, word);
	};
})();
