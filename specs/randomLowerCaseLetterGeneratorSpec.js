describe('Random lower case letter generator', function() {
	var sinon = require('sinon');
	var expect = require('chai').expect;
	var _ = require('underscore');
	var randomLowerCaseLetterGenerator = require('../randomLowerCaseLetterGenerator');

	before(function() {
		sinon.stub(_, 'random');
	});

	it("should generate 'a' as lowest value", function() {
		_.random.withArgs(97, 122).returns(97);
		expect(randomLowerCaseLetterGenerator.generate()).to.equal('a');
	});

	it("should generate 'z' as highest value", function() {
		_.random.withArgs(97, 122).returns(122);
		expect(randomLowerCaseLetterGenerator.generate()).to.equal('z');
	});
});
