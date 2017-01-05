describe('Bloom Filters Analysis', function () {
	var expect = require('chai').expect;
	var sinon = require('sinon');
	var mockery = require('mockery');
	var q = require('q');
	var randomWordGenerator = require('../randomWordGenerator');
	var binaryDictionary = require('../binaryDictionary');
	var bloomFilters;
	var bloomFiltersAnalysis;

	before(function () {
		mockery.enable();
		mockery.warnOnUnregistered(false);
		mockery.registerMock('request-promise', function () {
			return q('foo\nbar\nbaz');
		});
		bloomFilters = require('../bloomFilters');
		bloomFiltersAnalysis = require('../bloomFiltersAnalysis');
	});

	after(function () {
		mockery.deregisterMock('request-promise');
	});

	describe('Analyzing bloom filters', function () {
		before(function () {
			sinon.stub(randomWordGenerator, 'generate');
			sinon.stub(bloomFilters, 'lookup');
			sinon.stub(binaryDictionary, 'lookup');
			sinon.spy(console, 'log');
		});

		after(function () {
			bloomFilters.lookup.restore();
		});

		afterEach(function () {
			randomWordGenerator.generate.reset();
		});

		describe('Single word', function () {
			before(function () {
				randomWordGenerator.generate.returns('abcde');
			});

			after(function () {
				// randomWordGenerator.generate.reset();
			});

			afterEach(function () {
				console.log.reset();
			});

			it('should log false positive', function () {
				bloomFilters.lookup.withArgs('abcde').returns(true);
				binaryDictionary.lookup.withArgs('abcde').returns(false);

				bloomFiltersAnalysis.analyze(1);

				sinon.assert.calledWithMatch(console.log, bloomFiltersAnalysis.FALSE_POSITIVE_LABEL + 'abcde');
			});

			it('should not log true positive', function () {
				bloomFilters.lookup.withArgs('abcde').returns(true);
				binaryDictionary.lookup.withArgs('abcde').returns(true);

				bloomFiltersAnalysis.analyze(1);

				sinon.assert.neverCalledWith(console.log, 'abcde');
			});

			it('should not log negative', function () {
				bloomFilters.lookup.withArgs('abcde').returns(false);
				binaryDictionary.lookup.withArgs('abcde').returns(false);

				bloomFiltersAnalysis.analyze(1);

				sinon.assert.neverCalledWith(console.log, 'abcde');
			});
		});

		describe.only('Multiple words', function () {
			var FALSE_POSITIVE_1 = 'abcde';
			var FALSE_POSITIVE_2 = 'bcdef';
			var TRUE_POSITIVE_1 = 'cdefg';
			var TRUE_POSITIVE_2 = 'defgh';
			var NEGATIVE_1 = 'efghi';
			var NEGATIVE_2 = 'fghij';

			function defineFalsePositive(word) {
				bloomFilters.lookup.withArgs(word).returns(true);
				binaryDictionary.lookup.withArgs(word).returns(false);
			}

			function defineTruePositive(word) {
				bloomFilters.lookup.withArgs(word).returns(true);
				binaryDictionary.lookup.withArgs(word).returns(true);
			}

			function defineNegative(word) {
				bloomFilters.lookup.withArgs(word).returns(false);
			}

			function defineRandomWords(words) {
				for (var i = 0; i < words.length; i++) {
					randomWordGenerator.generate.onCall(i).returns(words[i]);
				}
			}

			before(function () {
				defineFalsePositive(FALSE_POSITIVE_1);
				defineFalsePositive(FALSE_POSITIVE_2);
				defineTruePositive(TRUE_POSITIVE_1);
				defineTruePositive(TRUE_POSITIVE_2);
				defineNegative(NEGATIVE_1);
				defineNegative(NEGATIVE_2);
			});

			describe('Logging false positives', function () {
				before(function () {
					defineRandomWords([FALSE_POSITIVE_1, FALSE_POSITIVE_2, NEGATIVE_1, NEGATIVE_2, TRUE_POSITIVE_1, TRUE_POSITIVE_2]);
				});

				beforeEach(function () {
					bloomFiltersAnalysis.analyze(6);
				});

				it('logs false positives', function () {
					sinon.assert.calledWith(console.log, bloomFiltersAnalysis.FALSE_POSITIVE_LABEL + FALSE_POSITIVE_1);
					sinon.assert.calledWith(console.log, bloomFiltersAnalysis.FALSE_POSITIVE_LABEL + FALSE_POSITIVE_2);
				});

				it('does not log true positives', function () {
					sinon.assert.neverCalledWith(console.log, TRUE_POSITIVE_1);
					sinon.assert.neverCalledWith(console.log, TRUE_POSITIVE_2);
				});

				it('does not log negatives', function () {
					sinon.assert.neverCalledWith(console.log, NEGATIVE_1);
					sinon.assert.neverCalledWith(console.log, NEGATIVE_2);
				});

				it('should log number of false positives', function () {
					sinon.assert.calledWith(console.log, bloomFiltersAnalysis.NUMBER_OF_FALSE_POSITIVES_LABEL + 2);
				});
			});

			describe('Logging percentage of false positives', function () {
				it('should log integer percentage', function () {
					defineRandomWords([FALSE_POSITIVE_1, FALSE_POSITIVE_2, NEGATIVE_1, NEGATIVE_2, TRUE_POSITIVE_1, TRUE_POSITIVE_2]);
					bloomFiltersAnalysis.analyze(6);
					sinon.assert.calledWith(console.log, bloomFiltersAnalysis.PERCENTAGE_OF_FALSE_POSITIVES_LABEL + "50%");
				});

				it('should round percentage down to integer', function () {
					defineRandomWords([FALSE_POSITIVE_1, TRUE_POSITIVE_1, TRUE_POSITIVE_2]);
					bloomFiltersAnalysis.analyze(3);
					sinon.assert.calledWith(console.log, bloomFiltersAnalysis.PERCENTAGE_OF_FALSE_POSITIVES_LABEL + "33%");
				});

				it('should round percentage up to integer', function () {
					defineRandomWords([FALSE_POSITIVE_1, TRUE_POSITIVE_1, FALSE_POSITIVE_2]);
					bloomFiltersAnalysis.analyze(3);
					sinon.assert.calledWith(console.log, bloomFiltersAnalysis.PERCENTAGE_OF_FALSE_POSITIVES_LABEL + "67%");
				});
			});
		});
	});
});
