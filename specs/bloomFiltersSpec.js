describe('Bloom Filters', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var mockery = require('mockery');
	var q = require('q');
	var bitArray = require('../bitArray');
	var hasher = require('../hasher');
	var rp;
	var bloomFilters;
	var FOO_HASH_1 = 15;
	var FOO_HASH_2 = 25;
	var FOO_HASH_3 = 35;
	var BAR_HASH_1 = 17;
	var BAR_HASH_2 = 27;
	var BAR_HASH_3 = 37;
	var BAZ_HASH_1 = 19;
	var BAZ_HASH_2 = 29;
	var BAZ_HASH_3 = 39;

	before(function () {
		sinon.stub(hasher, 'getHash');

		mockery.enable();
		mockery.warnOnUnregistered(false);
		mockery.registerMock('request-promise', function () {
			return q('foo\\nbar\\nbaz');
		});
		rp = require('request-promise');
		bloomFilters = require('../bloomFilters');
	});

	beforeEach(function () {
		hasher.getHash.withArgs('foo', 1).returns(FOO_HASH_1);
		hasher.getHash.withArgs('bar', 1).returns(BAR_HASH_1);
		hasher.getHash.withArgs('baz', 1).returns(BAZ_HASH_1);
		hasher.getHash.withArgs('foo', 2).returns(FOO_HASH_2);
		hasher.getHash.withArgs('bar', 2).returns(BAR_HASH_2);
		hasher.getHash.withArgs('baz', 2).returns(BAZ_HASH_2);
		hasher.getHash.withArgs('foo', 3).returns(FOO_HASH_3);
		hasher.getHash.withArgs('bar', 3).returns(BAR_HASH_3);
		hasher.getHash.withArgs('baz', 3).returns(BAZ_HASH_3);
		bitArray.clear();
	});

	describe('Loading bit array from dictionary', function () {
		describe('Single hash function', function () {
			it('should set hash for each word', function (done) {
				hasher.NUM_HASHES = 1;

				bloomFilters.loadDictionary('http://codekata.com/data/wordlist.txt')
					.then(function () {
						expect(bitArray.getBit(FOO_HASH_1)).to.equal(1);
						expect(bitArray.getBit(BAR_HASH_1)).to.equal(1);
						expect(bitArray.getBit(BAZ_HASH_1)).to.equal(1);
						done();
					})
					.catch(function (err) {
						done(err);
					});
			});
		});

		describe('Multiple hash functions', function () {
			it('should set all hashes for each word', function (done) {
				hasher.NUM_HASHES = 3;

				bloomFilters.loadDictionary('http://codekata.com/data/wordlist.txt')
					.then(function () {
						expect(bitArray.getBit(FOO_HASH_1)).to.equal(1);
						expect(bitArray.getBit(BAR_HASH_1)).to.equal(1);
						expect(bitArray.getBit(BAZ_HASH_1)).to.equal(1);
						expect(bitArray.getBit(FOO_HASH_2)).to.equal(1);
						expect(bitArray.getBit(BAR_HASH_2)).to.equal(1);
						expect(bitArray.getBit(BAZ_HASH_2)).to.equal(1);
						expect(bitArray.getBit(FOO_HASH_3)).to.equal(1);
						expect(bitArray.getBit(BAR_HASH_3)).to.equal(1);
						expect(bitArray.getBit(BAZ_HASH_3)).to.equal(1);
						done();
					})
					.catch(function (err) {
						done(err);
					});
			});
		})
	});

	describe('Looking up word', function () {
		describe('Single hash function', function () {
			beforeEach(function () {
				hasher.NUM_HASHES = 1;
				hasher.getHash.withArgs('foo', 1).returns(FOO_HASH_1);
			});

			it('should recognize a word whose single hash is a hit', function () {
				bitArray.setBit(FOO_HASH_1);
				expect(bloomFilters.lookup('foo')).to.be.true;
			});

			it('should not recognize a word whose single hash is a miss', function () {
				expect(bloomFilters.lookup('foo')).to.be.false;
			});
		});

		describe('Multiple hash functions', function () {
			beforeEach(function () {

				hasher.NUM_HASHES = 3;
			});

			it('should not recognize a word for which one of multiple hashes is a miss', function () {
				var MISS_HASH = 42;

				hasher.getHash.withArgs('nearMiss', 1).returns(FOO_HASH_3);
				hasher.getHash.withArgs('nearMiss', 2).returns(MISS_HASH);
				hasher.getHash.withArgs('nearMiss', 3).returns(BAR_HASH_2);
				bitArray.setBit(FOO_HASH_3);
				bitArray.setBit(BAR_HASH_2);

				expect(bloomFilters.lookup('nearMiss')).to.be.false;
			});

			it('should recognize a word for which all of multiple hashes are hits', function () {
				bitArray.setBit(FOO_HASH_1);
				bitArray.setBit(FOO_HASH_2);
				bitArray.setBit(FOO_HASH_3);

				expect(bloomFilters.lookup('foo')).to.be.true;
			});
		});
	});
});
