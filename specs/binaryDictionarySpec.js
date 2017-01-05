describe('Binary Dictionary', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var mockery = require('mockery');
	var q = require('q');
	var rp;
	var binaryDictionary;

	before(function () {
		mockery.enable();
		mockery.warnOnUnregistered(false);
		mockery.registerMock('request-promise', function () {
			return q('foo\nbar\nbaz');
		});
		rp = require('request-promise');
		binaryDictionary = require('../binaryDictionary');
	});

	describe('Loading binary dictionary from web', function () {
		var WORD_LIST_URL = 'http://codekata.com/data/wordlist.txt';
		it('should load all words into array', function (done) {
			binaryDictionary.loadDictionary(WORD_LIST_URL)
				.then(function () {
					expect(binaryDictionary.getWords()).to.equal(['foo', 'bar', 'baz']);
					done();
				})
				.catch(function (err) {
					done(err);
				});
		});
	});

	xdescribe('Looking up word', function () {
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
			expect(binaryDictionary.lookup('nearMiss')).to.be.false;
		});

		it('should recognize a word for which all hashes are hits', function () {
			expect(binaryDictionary.lookup('foo')).to.be.true;
			expect(binaryDictionary.lookup('bar')).to.be.true;
			expect(binaryDictionary.lookup('baz')).to.be.true;
		});
	});
});
