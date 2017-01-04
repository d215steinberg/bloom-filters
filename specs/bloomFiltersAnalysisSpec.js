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

	describe('Analyzing bloom filters', function (done) {
		it('should log false positive', sinon.test(function (done) {
			this.stub(randomWordGenerator, 'generate').returns('abcde');
			this.stub(bloomFilters, 'lookup').withArgs('abcde').returns(true);
			this.stub(binaryDictionary, 'lookup').withArgs('abcde').returns(false);
			sinon.spy(console, 'log');

			bloomFiltersAnalysis.analyze();

			sinon.assert.calledWith(console.log, 'abcde');
		}));
	});
});
