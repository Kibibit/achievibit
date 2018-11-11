var imTheDevilILoveMetal = require('../achievements/imTheDevilILoveMetal.achievement');
var expect = require('chai').expect;

describe('imTheDevilILoveMetal achievement', function() {
	it('should be granted to PR creator if PR number is a sequence of 2 sixes (6)', function() {
		var testShall = new Shall();
		var pullRequest = new PullRequest();

		pullRequest.number = 66;

		imTheDevilILoveMetal.check(pullRequest, testShall);
		expect(testShall.grantedToUsername).to.be.a('string');
		expect(testShall.grantedToUsername).to.equal('creator');
		expect(testShall.grantedAchievement).to.be.an('object');
		console.log(`-${pullRequest.number}-`);
	});

	it('should be granted to PR creator if PR number is a sequence of more then 2 sixes (6)', function() {
		var testShall = new Shall();
		var pullRequest = new PullRequest();

		pullRequest.number = 6666;

		imTheDevilILoveMetal.check(pullRequest, testShall);
		expect(testShall.grantedToUsername).to.be.a('string');
		expect(testShall.grantedToUsername).to.equal('creator');
		expect(testShall.grantedAchievement).to.be.an('object');
		console.log(`-${pullRequest.number}-`);
	});

	it('should not grant if PR number is 6', function() {
		var testShall = new Shall();
		var pullRequest = new PullRequest();

		pullRequest.number = 6;

		imTheDevilILoveMetal.check(pullRequest, testShall);
		expect(testShall.grantedToUsername).to.not.exist;
		expect(testShall.grantedToUsername).to.not.exist;
		console.log(`-${pullRequest.number}-`);
	});

	it('should not grand if PR number is not only a sequence of sixes (6)', function() {
		var testShall = new Shall();
		var pullRequest = new PullRequest();

		pullRequest.number = 1666;

		imTheDevilILoveMetal.check(pullRequest, testShall);
		expect(testShall.grantedToUsername).to.not.exist;
		expect(testShall.grantedToUsername).to.not.exist;
		console.log(`-${pullRequest.number}-`);
	});

	it('should not fail if PR number does not exist', function() {
		var testShall = new Shall();
		var pullRequest = new PullRequest();

		imTheDevilILoveMetal.check(pullRequest, testShall);
		expect(testShall.grantedToUsername).to.not.exist;
		expect(testShall.grantedToUsername).to.not.exist;
	});

});

function Shall() {
	var self = this;

	self.grantedAchievement = undefined;
	self.grantedToUsername = undefined;

	self.grant = function(username, achievementObject) {
		self.grantedToUsername = username;
		self.grantedAchievement = achievementObject;
	};
};

function PullRequest() {
	return {
		'id': 'test',
		'url': 'url',
		'creator': {
			'username': 'creator'
		}
	};
};
