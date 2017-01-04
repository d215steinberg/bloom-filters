describe('Bloom Filters Analysis', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var bloomFilters = require('../bloomFilters');
	var randomWordGenerator = require('../randomWordGenerator');
	var binaryDictionary = require('../binaryDictionary');
	var bloomFiltersAnalysis = require('../bloomFiltersAnalysis');

	describe('Analyzing bloom filters', function (done) {
		beforeEach(function () {
			var WORD_LIST_URL = 'http://codekata.com/data/wordlist.txt';
			bloomFilters.loadDictionary(WORD_LIST_URL)
				.then(done)
		});

		it('should log false positive', function (done) {
			sinon.stub(randomWordGenerator, 'generate').return('abcde');
			bloomFilters.lookup('abcde').return(true);
			binaryDictionary.lookup('abcde').return(false);
			spyOn(console, 'log');

			bloomFilterAnalysis.analyze();

			expect(console.log).toHaveBeenCalledWith('abcde');
		});
	});
});
