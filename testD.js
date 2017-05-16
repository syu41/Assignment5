// Unit test for the decode function of the app

var chai = require('chai');
var expect = chai.expect; 
var Server = require('./app.js');

// a group of all the test cases
describe('Server', function() {
	// test case 1: test correct letter A's code
	it('decode() should return "A" because we giving it the morse code of A, should pass', function() {
		expect(Server.decode("SL", Server.morseTable)).to.equal("A");
	});

	// test case 2: test correct letter B's code
	it('decode() should return "Z" because we giving it the morse code of Z, should pass', function() {
		expect(Server.decode("LLSS", Server.morseTable)).to.equal("Z");
	});

	// test case 3: test incorrect letter B's code
	it('decode() should return "A" because we giving it the morse code of A, should fail because we expect it to return B', function() {
		expect(Server.decode("SL", Server.morseTable)).to.equal("B");
	});

	// test case 4: unmatching string
	it('checkMotion() should return "null" because we giving it a morse code not in the table, should pass', function() {
		expect(Server.decode("LLLL", Server.morseTable)).to.equal(null);
	});

	// test case 5: invalid input(letters other than L/S)
	it('checkMotion() should return "null" because we giving it invalid input, should pass', function() {
		expect(Server.decode("abcd", Server.morseTable)).to.equal(null);
	});

	// test case 6: invalid input(empty string)
	it('checkMotion() should return "null" because we giving it empty string, should pass', function() {
		expect(Server.decode("", Server.morseTable)).to.equal(null);
	});

});