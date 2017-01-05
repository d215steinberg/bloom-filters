describe('Random Word Generator', function() {
	var sinon = require('sinon');
	var expect = require('chai').expect;
	var randomWordGenerator = require('../randomWordGenerator');
	var randomLowercaseLetterGenerator = require('../randomLowercaseLetterGenerator');

	it('should generate a sequence of 5 random lower-case letters', function() {
		sinon.stub(randomLowercaseLetterGenerator, 'generate')
			.onCall(0).returns('a')
			.onCall(1).returns('z')
			.onCall(2).returns('m')
			.onCall(3).returns('e')
			.onCall(4).returns('o');
		expect(randomWordGenerator.generate()).to.equal('azmeo');
	});
});
