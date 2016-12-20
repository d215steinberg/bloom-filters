describe('Bloom Filters', function() {
	var expect = require('chai').expect;
	var bloomFilters = require('../bloomFilters');

	it('should look up a word', function() {
		expect(bloomFilters.lookup).to.be.a('function');
	});
});
