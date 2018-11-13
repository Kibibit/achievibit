var meepMeep = require('../achievements/meepMeep.achievement');
var expect = require('chai').expect;

describe('meepMeep achievement', function() {
  it('should grant if COMMENT was within 5 minutes', function() {
    var testShall = new Shall();
    var pullRequest = new pullRequest();

    pullRequest.createdOn = '2018-11-12T16:10:30Z';
    pullRequest.comments[0].createdOn = '2018-11-12T16:15:00Z';

    meepMeep.check(pullRequest,testShall);
    //TO-DO
  });

  it('should grant if INLINE-COMMENT was within 5 minutes', function() {
    var testShall = new testShall();
    var pullRequest = new pullRequest();

    pullRequest.createdOn = '2018-11-12T16:10:30Z';
    pullRequest.inlineComments[0].createdOn = '2018-11-12T16:15:00Z';

    meepMeep.check(pullRequest,testShall);
    //TO-DO    
  });

  it('should grant if COMMENT was before INLINE-COMMENT within 5 minutes', function() {
    var testShall = new testShall();
    var pullRequest = new pullRequest();

    pullRequest.createdOn = '2018-11-12T16:10:30Z';
    pullRequest.comments[0].createdOn = '2018-11-12T16:15:00Z';
    pullRequest.inlineComments[0].createdOn = '2018-11-12T16:15:01Z';

    meepMeep.check(pullRequest,testShall);
    //TO-DO   
    //check that only COMMENT got it and not INLINE
  });
})
