(function($, axios) {
  $(function() {
    // handle auth

    function authenticate(
      firebaseToken,
      githubToken,
      githubUsername,
      timezone) {

      // Make a request for a user with a given ID
      var authUrl =
        encodeQueryData('/authUsers', {
          firebaseToken: firebaseToken,
          githubToken: githubToken,
          githubUsername: githubUsername,
          timezone: timezone
        });

      axios.get(authUrl)
        .then(function (response) {
          // change UI based on result
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function createWebhook(
      repo,
      firebaseToken,
      newState) {

      // Make a request for a user with a given ID
      var createWebhookUrl =
        encodeQueryData('/createWebhook', {
          repo: repo,
          firebaseToken: firebaseToken,
          newState: newState
        });

      axios.get(createWebhookUrl)
        .then(function (response) {
          console.log(response);
          // change UI based on result
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    function encodeQueryData(urlBase, data) {
      var ret = [];
      for (var d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }

      return urlBase + '?' + ret.join('&');
    }

  }); // end of document ready
})(jQuery, axios); // end of jQuery name space
