describe('Random lower case letter generator', function() {
	var sinon = require('sinon');
	var expect = require('chai').expect;
	var _ = require('underscore');
	var randomLowerCaseLetterGenerator = require('../randomLowerCaseLetterGenerator');

	before(function() {
		sinon.stub(_, 'random');
	});

	it("should generate 'a' as lowest value", function() {
		_.random.withArgs(randomLowerCaseLetterGenerator.ASCII_FOR_LOWERCASE_A, randomLowerCaseLetterGenerator.ASCII_FOR_LOWERCASE_Z)
			.returns(randomLowerCaseLetterGenerator.ASCII_FOR_LOWERCASE_A);
		expect(randomLowerCaseLetterGenerator.generate()).to.equal('a');
	});

	it("should generate 'z' as highest value", function() {
		_.random.withArgs(randomLowerCaseLetterGenerator.ASCII_FOR_LOWERCASE_A, randomLowerCaseLetterGenerator.ASCII_FOR_LOWERCASE_Z)
			.returns(randomLowerCaseLetterGenerator.ASCII_FOR_LOWERCASE_Z);
		expect(randomLowerCaseLetterGenerator.generate()).to.equal('z');
	});

	it("should generate letter between 'a' and 'z'", function() {
		_.random.restore();
		expect(randomLowerCaseLetterGenerator.generate()).to.be.within('a', 'z');
	});
});
