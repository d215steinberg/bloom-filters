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

	after(function() {
		mockery.deregisterMock('request-promise');
	});

	describe('Analyzing bloom filters', function () {
		before(function() {
			sinon.spy(console, 'log');
		});

		afterEach(function() {
			console.log.reset();
		});

		it('should log false positive', sinon.test(function () {
			this.stub(randomWordGenerator, 'generate').returns('abcde');
			this.stub(bloomFilters, 'lookup').withArgs('abcde').returns(true);
			this.stub(binaryDictionary, 'lookup').withArgs('abcde').returns(false);

			bloomFiltersAnalysis.analyze();

			sinon.assert.calledWith(console.log, 'abcde');
		}));

		it('should not log true positive', sinon.test(function () {
			this.stub(randomWordGenerator, 'generate').returns('abcde');
			this.stub(bloomFilters, 'lookup').withArgs('abcde').returns(true);
			this.stub(binaryDictionary, 'lookup').withArgs('abcde').returns(true);

			bloomFiltersAnalysis.analyze();

			sinon.assert.neverCalledWith(console.log, 'abcde');
		}));
	});
});
