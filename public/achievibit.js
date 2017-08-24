(function($, axios) {
  $(function() {
    // handle auth

    var loggedInUser;

    // listen to auth change to show user as logged in
    // if token is present.
    // if so, request full user from achievibit, and render the userState!

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
          changeUserStateUI(response);
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

    function changeUserStateUI(user) {
      if (!user) {
        renderLogIn();
      } else {
        renderUserState(user);
      }
    }

    function renderLogIn() {
      var userState = $('user-state');
      userState.html('<button class="login">login</button>');
      userState.find('button.login').click(function() {
        // firebase login
        console.log('login user using oauth');
        //authenticate()
        //.then(function(user) {
        //  renderUserState(user);
        //});
      });
    }

    function renderUserState(user) {
      var userState = $('user-state');
      userState.html([
        '<img class="avatar" href=', user.avatar, '>',
        '<span class="username">', user.username, '</span>',
        '<button class="settings"></button>',
        '<button class="logout">logout</button>'
      ].join(''));

      userState.find('button.settings').click(openSettingsDialog);
      userState.find('button.logout').click(logoutUser);
    }

    function logoutUser() {
      // logout user using firebase
      then(function() {
        renderUserState();
      });
    }

    function openSettingsDialog() {
      vex.dialog.open({
        message: 'Enter your username and password:',
        input: [ // should generate based on given settings
          '<input name="username" type="text" ',
          'placeholder="Username" required />',
          '<input name="password" type="password" ',
          'placeholder="Password" required />'
        ].join(''),
        buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Discard' })
        ],
        callback: function (data) {
          if (!data) {
            // discard everything
            console.log('Settings changes discarded');
          } else {
            // send data to server to update user settings
            console.log('Username', data.username, 'Password', data.password);
          }
        }
      });
    }

  }); // end of document ready
})(jQuery, axios); // end of jQuery name space
