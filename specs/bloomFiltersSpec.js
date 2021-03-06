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
			return q('foo\nbar\nbaz');
		});
		rp = require('request-promise');
		bloomFilters = require('../bloomFilters');
	});

	function defineHashValues(word, hashValue1, hashValue2, hashValue3) {
		hasher.getHash.withArgs(word, 1).returns(hashValue1);
		hasher.getHash.withArgs(word, 2).returns(hashValue2);
		hasher.getHash.withArgs(word, 3).returns(hashValue3);
	}

	beforeEach(function () {
		hasher.NUM_HASHES = 3;
		defineHashValues('foo', FOO_HASH_1, FOO_HASH_2, FOO_HASH_3);
		defineHashValues('bar', BAR_HASH_1, BAR_HASH_2, BAR_HASH_3);
		defineHashValues('baz', BAZ_HASH_1, BAZ_HASH_2, BAZ_HASH_3);
	});

	describe('Loading bit array from dictionary', function () {
		var WORD_LIST_URL = 'http://codekata.com/data/wordlist.txt';
		it('should set all hashes for each word', function (done) {
			bloomFilters.loadDictionary(WORD_LIST_URL)
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
	});

	describe('Looking up word', function () {
		beforeEach(function () {
			var MISS_HASH = 42;
			defineHashValues('nearMiss', FOO_HASH_3, MISS_HASH, BAR_HASH_2);
			bitArray.setBit(FOO_HASH_1);
			bitArray.setBit(FOO_HASH_2);
			bitArray.setBit(FOO_HASH_3);
			bitArray.setBit(BAR_HASH_1);
			bitArray.setBit(BAR_HASH_2);
			bitArray.setBit(BAR_HASH_3);
			bitArray.setBit(BAZ_HASH_1);
			bitArray.setBit(BAZ_HASH_2);
			bitArray.setBit(BAZ_HASH_3);
		});

		it('should not recognize a word for which one of multiple hashes is a miss', function () {
			expect(bloomFilters.lookup('nearMiss')).to.be.false;
		});

		it('should recognize a word for which all hashes are hits', function () {
			expect(bloomFilters.lookup('foo')).to.be.true;
			expect(bloomFilters.lookup('bar')).to.be.true;
			expect(bloomFilters.lookup('baz')).to.be.true;
		});
	});
});
