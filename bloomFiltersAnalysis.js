(function() {
	var randomWordGenerator = require('./randomWordGenerator');

	module.exports.analyze = function() {
		var word = randomWordGenerator.generate();
		console.log(word);
	};
})();
