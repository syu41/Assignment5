// unit test for the check motion length function

var chai = require('chai');
var expect = chai.expect; 
var Server = require('./app.js');

// a group of all test cases
describe('Server', function() {
	// test case 1: long motion
	it('checkMotion() should return "L" because the motion duration is longer than 5000, should pass', function() {
		expect(Server.checkMotion(1, 6502)).to.equal("L");
	});

	// test case 2: long motion
	it('checkMotion() should return "L" because the motion duration is longer than 5000, should fail', function() {
		expect(Server.checkMotion(1000, 7808)).to.equal("S");
	});

	// test case 3: short motion
	it('checkMotion() should return "S" because the motion duration is shorter than 5000, should pass', function() {
		expect(Server.checkMotion(1, 300)).to.equal("S");
	});

	// test case 4: short motion
	it('checkMotion() should return "S" because the motion duration is shorter than 5000, should fail', function() {
		expect(Server.checkMotion(400, 1000)).to.equal("L");
	});

	// test case 5: invalid input(negative time)
	it('checkMotion() should return "S" because the motion duration is shorter than 3000, should pass', function() {
		expect(Server.checkMotion(1000, 300)).to.equal("S");
	});

});
