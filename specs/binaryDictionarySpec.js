describe('Binary Dictionary', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var mockery = require('mockery');
	var q = require('q');
	var rp;
	var binaryDictionary;
	var WORD_LIST_URL = 'http://codekata.com/data/wordlist.txt';

	before(function () {
		mockery.enable();
		mockery.warnOnUnregistered(false);
		mockery.registerMock('request-promise', function () {
			return q('word1\nword2\nword3\nword4\n\word5');
		});
		rp = require('request-promise');
		binaryDictionary = require('../binaryDictionary');
	});

	describe('Loading binary dictionary from web', function () {
		it('should load all words into array', function (done) {
			binaryDictionary.loadDictionary(WORD_LIST_URL)
				.then(function () {
					expect(binaryDictionary.getWords()).to.eql(['word1', 'word2', 'word3', 'word4', 'word5']);
					done();
				})
				.catch(function (err) {
					done(err);
				});
		});
	});

	describe('Looking up word', function () {
		beforeEach(function (done) {
			binaryDictionary.loadDictionary(WORD_LIST_URL)
				.then(done);
		});

		it('should find word in middle of list', function () {
			expect(binaryDictionary.lookup('word3')).to.be.true;
		});

		it('should find a word in first part of list', function () {
			expect(binaryDictionary.lookup('word2')).to.be.true;
		});

		it('should not find a word that precedes list', function() {
			expect(binaryDictionary.lookup('word0')).to.be.false;
		});

		it('should find a word in latter part of list', function () {
			expect(binaryDictionary.lookup('word4')).to.be.true;
		});

		it('should not find a word that follows list', function() {
			expect(binaryDictionary.lookup('word6')).to.be.false;
		});

		it('should find a word at start of list', function() {
			expect(binaryDictionary.lookup('word1')).to.be.true;
		});

		it('should find a word at end of list', function() {
			expect(binaryDictionary.lookup('word5')).to.be.true;
		});
	});
});
