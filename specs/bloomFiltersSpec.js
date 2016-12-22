describe('Bloom Filters', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var bloomFilters = require('../bloomFilters');
	var bitArray = require('../bitArray');
	var hasher = require('../hasher');

	before(function () {
		sinon.stub(hasher, 'getHash');
	});

	beforeEach(function () {
		bitArray.clear();
	});

	describe('Single hash function', function () {
		beforeEach(function () {
			hasher.NUM_HASHES = 1;
		});

		it('should recognize a word whose single hash is a hit', function () {
			hasher.getHash.withArgs('foo', 1).returns(17);
			bitArray.setBit(17);

			expect(bloomFilters.lookup('foo')).to.be.true;
		});

		it('should not recognize a word whose single hash is a miss', function () {
			hasher.NUM_HASHES = 1;
			hasher.getHash.withArgs('foo', 1).returns(17);
			expect(bloomFilters.lookup('foo')).to.be.false;
		});
	});

	describe('Multiple hash functions', function () {
		beforeEach(function() {
			hasher.NUM_HASHES = 3;
		});

		it('should not recognize a word for which one of multiple hashes is a miss', function () {
			hasher.getHash.withArgs('foo', 1).returns(15);
			hasher.getHash.withArgs('foo', 2).returns(17);
			hasher.getHash.withArgs('foo', 3).returns(19);
			bitArray.setBit(15);
			bitArray.setBit(19);

			expect(bloomFilters.lookup('foo')).to.be.false;
		});

		it('should recognize a word for which all of multiple hashes are hits', function () {
			hasher.getHash.withArgs('foo', 1).returns(15);
			hasher.getHash.withArgs('foo', 2).returns(17);
			hasher.getHash.withArgs('foo', 3).returns(19);
			bitArray.setBit(15);
			bitArray.setBit(17);
			bitArray.setBit(19);

			expect(bloomFilters.lookup('foo')).to.be.true;
		});
	});
});
