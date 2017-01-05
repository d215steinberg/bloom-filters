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

		describe('Single word', function () {
			before(function () {
				randomWordGenerator.generate.returns('abcde');
			});

			after(function () {
				randomWordGenerator.generate.reset();
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

				sinon.assert.neverCalledWithMatch(console.log, 'abcde');
			});

			it('should not log negative', function () {
				bloomFilters.lookup.withArgs('abcde').returns(false);
				binaryDictionary.lookup.withArgs('abcde').returns(false);

				bloomFiltersAnalysis.analyze(1);

				sinon.assert.neverCalledWithMatch(console.log, 'abcde');
			});
		});

		describe.only('Multiple words', function () {
			var FALSE_POSITIVE_1 = 'abcde';
			var FALSE_POSITIVE_2 = 'bcdef';
			var TRUE_POSITIVE_1 = 'cdefg';
			var TRUE_POSITIVE_2 = 'defgh';
			var NEGATIVE_1 = 'efghi';
			var NEGATIVE_2 = 'fghij';

			before(function () {
				randomWordGenerator.generate
					.onCall(0).returns(FALSE_POSITIVE_1)
					.onCall(1).returns(TRUE_POSITIVE_1)
					.onCall(2).returns(NEGATIVE_1)
					.onCall(3).returns(NEGATIVE_2)
					.onCall(4).returns(TRUE_POSITIVE_2)
					.onCall(5).returns(FALSE_POSITIVE_2);

				bloomFilters.lookup.withArgs(FALSE_POSITIVE_1).returns(true);
				binaryDictionary.lookup.withArgs(FALSE_POSITIVE_1).returns(false);

				bloomFilters.lookup.withArgs(FALSE_POSITIVE_2).returns(true);
				binaryDictionary.lookup.withArgs(FALSE_POSITIVE_2).returns(false);

				bloomFilters.lookup.withArgs(TRUE_POSITIVE_1).returns(true);
				binaryDictionary.lookup.withArgs(TRUE_POSITIVE_1).returns(true);

				bloomFilters.lookup.withArgs(TRUE_POSITIVE_2).returns(true);
				binaryDictionary.lookup.withArgs(TRUE_POSITIVE_2).returns(true);

				bloomFilters.lookup.withArgs(NEGATIVE_1).returns(false);
				bloomFilters.lookup.withArgs(NEGATIVE_2).returns(false);

				bloomFiltersAnalysis.analyze(6);
			});

			it('logs false positives', function () {
				sinon.assert.calledWithMatch(console.log, bloomFiltersAnalysis.FALSE_POSITIVE_LABEL + FALSE_POSITIVE_1);
				sinon.assert.calledWithMatch(console.log, bloomFiltersAnalysis.FALSE_POSITIVE_LABEL + FALSE_POSITIVE_2);
			});

			it('does not log true positives', function () {
				sinon.assert.neverCalledWithMatch(console.log, TRUE_POSITIVE_1);
				sinon.assert.neverCalledWithMatch(console.log, TRUE_POSITIVE_2);
			});

			it('does not log negatives', function () {
				sinon.assert.neverCalledWithMatch(console.log, NEGATIVE_1);
				sinon.assert.neverCalledWithMatch(console.log, NEGATIVE_2);
			});

			it('should log number of false positives', function () {
				sinon.assert.calledWithMatch(console.log, bloomFiltersAnalysis.NUMBER_OF_FALSE_POSITIVES_LABEL + 2);
			});
		});
	});
});
