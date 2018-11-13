var mockService = {};

mockService.mockAchievementNotification = function(req, res) {

  if (req.body.secret === process.env.FAKE_SECRET) {
    req.body.secret = undefined;
    var fakeAchieve =
      'https://ifyouwillit.com/wp-content/uploads/2014/06/github1.png';
    io.sockets.emit(req.params.username, {
      avatar: fakeAchieve,
      name: 'FAKE ACHIEVEMENT!',
      short: 'this is to test achievements',
      description: 'you won\'t get an actual achievement though :-/',
      relatedPullRequest: 'FAKE_IT'
    });
  }

  res.json({
    message: 'b33p b33p! faked a socket.io update'
  });
};

module.exports = mockService;
