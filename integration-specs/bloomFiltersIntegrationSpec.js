describe('Bloom Filters Integration', function () {
	var expect = require('chai').expect;
	var bloomFilters = require('../bloomFilters');
	var WORD_LIST_URL = 'http://codekata.com/data/wordlist.txt';

	before(function (done) {
		this.timeout(60000);
		bloomFilters.loadDictionary(WORD_LIST_URL)
			.then(function () {
				done();
			});
	});

	it('should successfully look up a real word', function () {
		expect(bloomFilters.lookup('bulldog')).to.be.true;
	});
});
