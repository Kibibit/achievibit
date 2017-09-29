var configurationServiceMock = {
  full: function() {
    return {
      get: function() {
        return {
          url: 'mock',
          testDB: true,
          firebaseType: 1,
          firebaseProjectId: 2,
          firebasePrivateKeyId: 3,
          firebasePrivateKey: 4,
          firebaseClientEmail: 5,
          firebaseClientId: 6,
          firebaseAuthUri: 7,
          firebaseTokenUri: 8,
          firebaseAPx509CU: 9,
          firebaseCx509CU: 10
        };
      }
    };
  },
  empty: function() {
    return {
      get: function() { return {}; }
    };
  }
};

module.exports = configurationServiceMock;
