(function($, axios, vex, firebase, _) {
  $(function() {
    // handle auth

    var loggedInUser;
    var achievibitUser;
    var firebaseToken;
    var isNewLogIn = false;

    var provider = new firebase.auth.GithubAuthProvider();
    // add all the scopes we need
    provider.addScope('user:email');
    provider.addScope('read:org');
    provider.addScope('repo:status');
    provider.addScope('write:repo_hook');

    // listen to auth change to show user as logged in
    // if token is present.
    // if so, request full user from achievibit, and render the userState!
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (isNewLogIn) {
          isNewLogIn = false;
          return;
        }

        loggedInUser = user;

        loggedInUser.getToken(/* forceRefresh */ true).then(function(idToken) {
          firebaseToken = idToken;

          // get achievibit user data
          axios.get('/authUsers', {
            params: {
              firebaseToken: firebaseToken
            }
          })
            .then(function (response) {
              // change UI based on result
              achievibitUser = response.data.achievibitUserData;
              changeUserStateUI(achievibitUser);
            })
            .catch(function (error) {
              console.log(error);
            });
        });
      } else {
        loggedInUser = null;
        changeUserStateUI();
      }
    });

    function authenticate() {

      var timezone = 5;
      var githubUsername = 'test';

      isNewLogIn = true;

      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a GitHub Access Token. You can use it to access
        // the GitHub API.
        var githubToken = result.credential.accessToken;

        var githubUsername = result.additionalUserInfo.username;

        loggedInUser = result.user;

        loggedInUser.getToken(/* forceRefresh */ true).then(function(idToken) {
          firebaseToken = idToken;

          // Make a request for a user with a given ID
          // var authUrl =
          //   encodeQueryData('/authUsers', {
          //     firebaseToken: firebaseToken,
          //     githubToken: githubToken,
          //     githubUsername: githubUsername,
          //     timezone: timezone
          //   });

          // get achievibit user data
          axios.get('/authUsers', {
            params: {
              firebaseToken: firebaseToken,
              githubToken: githubToken,
              githubUsername: githubUsername
            }
          })
            .then(function (response) {
              // change UI based on result
              achievibitUser = response.data.achievibitUserData;
              changeUserStateUI(achievibitUser);
            })
            .catch(function (error) {
              console.log(error);
            });
        });

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
      userState.html('<a href="#!" class="login">login</a>');
      userState.find('a.login').click(function() {
        authenticate();
      });
    }

    function renderUserState(user) {
      var userState = $('user-state');
      userState.html([
        '<a class="dropdown-button" style="height: 100%; display: flex; align-items: center;" href="#!" data-activates="dropdown1">',
        '<img class="avatar" src="', loggedInUser.photoURL, '" ',
        'style="height: 60%; border-radius: 4px; ',
        'margin-right: 10px;" alt="avatar">',
        '<span class="username">',
        user.username, '</span>',
        '<i class="material-icons right">arrow_drop_down</i></a>',
        '<ul id="dropdown1" class="dropdown-content" style="transform: translateY(64px);">',
        '<li><a href="/', user.username, '">Your profile</a></li>',
        '<li class="divider"></li>',
        '<li><a href="#!" class="help">Help</a></li>',
        '<li><a href="#!" class="settings">Settings</a></li>',
        '<li><a href="#!" class="logout">Sign out</a></li>',
        '</ul>'
      ].join(''));

      userState.find('a.settings').click(openSettingsDialog);
      userState.find('a.logout').click(logoutUser);
      $('.dropdown-button').dropdown();
    }

    function logoutUser() {
      firebase.auth().signOut();
    }

    function openSettingsDialog() {
      console.log('achievibit user', achievibitUser);
      var repoIntegration = [];
      _.forEach(achievibitUser.reposIntegration, function(repo) {
        repoIntegration.push([
          '<div>', repo.name,
          '<div class="switch">',
          '<label>Off',
          '<input name="', repo.name,
          '" type="checkbox" ', repo.integrated ? 'checked' : '' ,'>',
          '<span class="lever"></span>',
          'On</label>',
          '</div>',
          '</div>'
        ].join(''));
      });
      vex.dialog.open({
        message: 'User Settings',
        input: [ // should generate based on given settings
          '<select name="timezone" style="visibility: hidden"></select>',
          '<div class="switch">',
          '<label>Off',
          '<input name="postAsComment" type="checkbox">',
          '<span class="lever"></span>',
          'On</label>',
          '</div>',
          '<div>Repos Integration</div>',
          repoIntegration.join('')
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

      $('select').timezones();
      $('select').material_select();
      $('.vex-dialog-input').css({
        'overflow-y': 'auto',
        'overflow-x': 'hidden',
        'max-height': '80vh'
      });
    }

  }); // end of document ready
})(jQuery, axios, vex, firebase, _); // end of jQuery name space
