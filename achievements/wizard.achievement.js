var _ = require('lodash');

var wizard = {
  name: 'wizard',
  accumulative: true,
  check: function(pullRequest, shall, treasures) {
    var creatorTreasure = treasures[pullRequest.creator.username] || 0;
    var newlyCreatedAchievements = allAchievementFiles(pullRequest.files);

    var basicShort = 'Hello, my friend. Stay awhile and listen.';
    var wizardAvatar = 'images/achievements/wizard.achievement.jpg';

    var accumulativeAchievements = {
      1: {
        avatar: wizardAvatar,
        name: 'Novice Mage',
        accumulative: 0,
        short: basicShort,
        description: [
          '<p>You wrote an achievement for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>',
          '<p>Welcome to "The Brotherhood of achievibit". This is an ',
          'ancient brotherhood of mages and wizards that were formed by the ',
          'archangels to combat the three Prime Evils: ',
          'Source Controlless, Specsless and Codice Incomprehensibilis ',
          'when they were banished to the mortal realm.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      5: {
        avatar: wizardAvatar,
        name: 'Apprentice Mage',
        accumulative: 1,
        short: basicShort,
        description: [
          '<p>You wrote 5 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      10: {
        avatar: wizardAvatar,
        name: 'Initiate Mage',
        accumulative: 2,
        short: basicShort,
        description: [
          '<p>You wrote 10 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      15: {
        avatar: wizardAvatar,
        name: 'Journeyman Mage',
        accumulative: 3,
        short: basicShort,
        description: [
          '<p>You wrote 15 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      20: {
        avatar: wizardAvatar,
        name: 'Adept Mage',
        accumulative: 4,
        short: basicShort,
        description: [
          '<p>You wrote 20 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      30: {
        avatar: wizardAvatar,
        name: 'Magus Mage',
        accumulative: 5,
        short: basicShort,
        description: [
          '<p>You wrote 30 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      40: {
        avatar: wizardAvatar,
        name: 'Master Mage',
        accumulative: 6,
        short: [
          'Hello, my friend. Fasten your seatbelt and listen.'
        ].join(''),
        description: [
          '<p>You wrote 40 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      50: {
        avatar: wizardAvatar,
        name: 'Grandmaster Mage',
        accumulative: 7,
        short: [
          'That red light up ahead marks a place of grave danger. Do not stop!'
        ].join(''),
        description: [
          '<p>You wrote 50 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      60: {
        avatar: wizardAvatar,
        name: 'Legendary Mage',
        accumulative: 8,
        short: [
          'It takes time to master your skills... and use will hone your ',
          'technique. But take care to choose your new skills wisely.'
        ].join(''),
        description: [
          '<p>You wrote 60 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      70: {
        avatar: wizardAvatar,
        name: 'Transcended Mage',
        accumulative: 9,
        short: [
          'If you come across challenges and questions to which you seek ',
          'knowledge, seek me out and I will tell you what I can.'
        ].join(''),
        description: [
          '<p>You wrote 70 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      80: {
        avatar: wizardAvatar,
        name: 'Archmage Mage',
        accumulative: 10,
        short: [
          'While you are venturing deeper into the Labyrinth, you may ',
          'find tomes of great knowledge hidden there.'
        ].join(''),
        description: [
          '<p>You wrote 80 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      90: {
        avatar: wizardAvatar,
        name: 'Promethean Mage',
        accumulative: 11,
        short: [
          'I know of many myths and legends that may contain answers to ',
          'questions that may arise in your journeys into the Labyrinth.'
        ].join(''),
        description: [
          '<p>You wrote 90 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      100: {
        avatar: wizardAvatar,
        name: 'Exalted Mage',
        accumulative: 12,
        short: [
          'You may recover some mysterious things from the PRs you merge. ',
          'Some of great use to you... some of great peril! Bring them to me ',
          'and I\'ll reveal their secrets.'
        ].join(''),
        description: [
          '<p>You wrote 100 achievements for achievibit.</p>',
          '<p>you\'re not only achieving, you\'re guiding the heroes through ',
          'their quests.</p>',
          '<p>You fought great battles, and helped form great heroes. ',
          'I have a feeling you\'ll be rememberd for generations!</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      }
    };

    if (_.get(pullRequest, 'repository.fullname') === 'Kibibit/achievibit' &&
        newlyCreatedAchievements.length > 0) {

      var oldCreatorTreasure = creatorTreasure;
      creatorTreasure = creatorTreasure + newlyCreatedAchievements.length;

      var achievementsInRange = [];

      _.forEach(accumulativeAchievements, function(value, key) {
        if (_.inRange(key, oldCreatorTreasure, creatorTreasure + 1)) {
          achievementsInRange.push(value);
        }
      });

      _.forEach(achievementsInRange, function(achievement) {
        shall.grant(pullRequest.creator.username, achievement);
      });

      shall.progress(pullRequest.creator.username, creatorTreasure);
    }
  }
};

function allAchievementFiles(files) {
  return _.filter(files, function(file) {
    return _.endsWith(file.name, '.achievement.js') && file.isNewFile;
  });
}

module.exports = wizard;
