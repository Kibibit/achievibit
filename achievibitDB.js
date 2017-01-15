var _ = require('lodash');
var mongo = require('mongodb');
var monk = require('monk');
var nconf = require('nconf');

nconf.argv().env();

var url = nconf.get('databaseUrl');
var db = monk(url);

var collections = {
  repos: db.get('repos'),
  users: db.get('users')
};

var achievibitDB = {};

initCollections();

achievibitDB.insertItem = insertItem;
achievibitDB.updateItem = updateItem;
achievibitDB.findItem = findItem;
achievibitDB.updatePartially = updatePartially;
achievibitDB.updatePartialArray = updatePartialArray;

module.exports = achievibitDB;

function initCollections() {
  collections.repos.index( { fullname: 1 }, { unique: true, sparse: true } );
  collections.users.index( { username: 1 }, { unique: true, sparse: true } );
}

function insertItem(collection, item) {
  if (_.isNil(collection) || _.isNil(item)) return;
  return collections[collection].insert(item);
}

function updateItem(collection, identityObject, updateWith) {
  if (_.isNil(collection) || _.isNil(identityObject) || _.isNil(updateWith)) {
    return;
  }

  return collections[collection].update(identityObject, updateWith);
}

function updatePartially(collection, identityObject, updatePartial) {
  if (_.isNil(collection) || _.isNil(identityObject) || _.isNil(updatePartial)) {
    return;
  }

  return collections[collection].update(identityObject, {
    $set: updatePartial
  });
}

function updatePartialArray(collection, identityObject, updatePartial) {
  if (_.isNil(collection) || _.isNil(identityObject) || _.isNil(updatePartial)) {
    return;
  }

  return collections[collection].update(identityObject, {
    $addToSet: updatePartial
  });
}

function findItem(collection, identityObject) {
  if (_.isNil(collection) || _.isNil(identityObject)) return;
  return collections[collection].find(identityObject);
}
