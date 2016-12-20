describe('Bloom Filters', function() {
	var expect = require('chai').expect;
	var bloomFilters = require('../bloomFilters');
	var sinon = require('sinon');
	var hasher = require('../hasher');

	before(function() {
		sinon.stub(hasher, 'getHash').withArgs('foo').returns(17);
	});

	it('should look up a word', function() {
		expect(bloomFilters.lookup).to.be.a('function');
	});

	it('should recognize a word whose single hash is a hit', function() {
		bloomFilters.setBit(17);
		expect(bloomFilters.lookup('foo')).to.be.true;
	});

	it('should not recognize a word whose single hash is a miss', function() {
		expect(bloomFilters.lookup('foo')).to.be.false;
	});
});
