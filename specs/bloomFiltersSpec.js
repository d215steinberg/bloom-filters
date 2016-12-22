describe('Bloom Filters', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var rp = require('request-promise');
	var q = require('q');
	var bloomFilters = require('../bloomFilters');
	var bitArray = require('../bitArray');
	var hasher = require('../hasher');

	before(function () {
		sinon.stub(hasher, 'getHash');
	});

	beforeEach(function () {
		bitArray.clear();
	});

	describe('Loading bit array from dictionary', function() {
		beforeEach(function() {
			sinon.stub(rp, 'constructor').withArgs('http://codekata.com/data/wordlist.txt').returns(q('foo\\bar\\baz'));
		});

		describe('Single hash function', function() {
			it('should set hash for each word', function() {
				bloomFilters.loadDictionary('http://codekata.com/data/wordlist.txt')
					.then(function() {
						expect(bitArray.getBit(15)).to.equal(1);
						expect(bitArray.getBit(17)).to.equal(1);
						expect(bitArray.getBit(19)).to.equal(1);
					});
			});
		});
	});

	describe('Looking up word', function () {
		describe('Single hash function', function () {
			beforeEach(function () {
				hasher.NUM_HASHES = 1;
				hasher.getHash.withArgs('foo', 1).returns(17);
			});

			it('should recognize a word whose single hash is a hit', function () {
				bitArray.setBit(17);
				expect(bloomFilters.lookup('foo')).to.be.true;
			});

			it('should not recognize a word whose single hash is a miss', function () {
				expect(bloomFilters.lookup('foo')).to.be.false;
			});
		});

		describe('Multiple hash functions', function () {
			beforeEach(function () {
				hasher.NUM_HASHES = 3;
				hasher.getHash.withArgs('foo', 1).returns(15);
				hasher.getHash.withArgs('foo', 2).returns(17);
				hasher.getHash.withArgs('foo', 3).returns(19);
			});

			it('should not recognize a word for which one of multiple hashes is a miss', function () {
				bitArray.setBit(15);
				bitArray.setBit(19);

				expect(bloomFilters.lookup('foo')).to.be.false;
			});

			it('should recognize a word for which all of multiple hashes are hits', function () {
				bitArray.setBit(15);
				bitArray.setBit(17);
				bitArray.setBit(19);

				expect(bloomFilters.lookup('foo')).to.be.true;
			});
		});
	});
});
