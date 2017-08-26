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

        loggedInUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
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

        loggedInUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
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
        '<a class="dropdown-button" href="#!" data-activates="dropdown1">',
        '<img class="avatar" src="', loggedInUser.photoURL, '" alt="avatar">',
        '<span class="username">',
        user.username, '</span>',
        '<i class="material-icons right">arrow_drop_down</i></a>',
        '<ul id="dropdown1" class="dropdown-content">',
        '<li><a href="/', user.username, '"><i class="material-icons">account_circle</i>Your profile</a></li>',
        '<li class="divider"></li>',
        '<li><a href="#!" class="help"><i class="material-icons">help</i>Help</a></li>',
        '<li><a href="#!" class="settings"><i class="material-icons">settings</i>Settings</a></li>',
        '<li><a href="#!" class="logout"><i class="material-icons">power_settings_new</i>Sign out</a></li>',
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
          '<div class="repo-form-element">',
          repo.name,
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
        // message: 'Settings',
        input: [ // should generate based on given settings
          '<nav class="nav-extended settings">',
          '<div class="nav-wrapper">',
          '<a href="#" class="brand-logo"><i class="material-icons">settings</i>Settings</a>',
          '</div>',
          '<div class="nav-content">',
          '<ul class="tabs tabs-transparent">',
          '<li class="tab"><a href="#integrations">Integrations</a></li>',
          '<li class="tab"><a class="active" href="#preferences">Preferences</a></li>',
          '</ul>',
          '</div>',
          '</nav>',
          '<div id="integrations" class="col s12">',
          '<div class="integrations-title">',
          'Repositories',
          '<a class="refresh" href="#!">',
          '<i class="material-icons">refresh</i></a>',
          '</div>',
          repoIntegration.join(''),
          '</div>',
          '<div id="preferences" class="col s12">',
          '<div class="input-field col s12">',
          '<select name="timezone"></select>',
          '<label>Timezone</label>',
          '</div>',
          '<div class="repo-form-element">',
          'Post achievements as comment',
          '<div class="switch">',
          '<label>Off',
          '<input name="postAchievementsAsComments" ',
          'type="checkbox" ',
          achievibitUser.postAchievementsAsComments ? 'checked' : '',
          ,'>',
          '<span class="lever"></span>',
          'On</label>',
          '</div>',
          '</div>',
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
            var userSettings = {};
            _.forOwn(data, function(value, setting) {
              if (setting === 'postAchievementsAsComments') {
                userSettings[setting] = value === 'on';
                return;
              }

              if (setting === 'timezone') {
                var selected = $('.dropdown-content .selected').text();
                userSettings[setting] =
                  selected || $('input.select-dropdown').attr('value');
                return;
              }

              userSettings.reposIntegration =
                userSettings.reposIntegration || [];

              userSettings.reposIntegration.push({
                name: setting,
                integrated: value === 'on'
              });
            });

            var newSettings = _.merge(achievibitUser, userSettings);
            axios.post('/authUsers', {
              firebaseToken: firebaseToken,
              settings: newSettings
            })
              .then(function () {
                // change UI based on result
                achievibitUser = newSettings;
                // changeUserStateUI(achievibitUser);
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        }
      });

      $('a.refresh').click(function() {
        $('.integrations-title').after([
          '<div class="progress">',
          '<div class="indeterminate"></div>',
          '</div>'
        ].join(''));
        // refresh repositories for user
        setTimeout(function() {
          $('.progress').remove();
        }, 3000);
      });
      $('select').timezones();

      if (achievibitUser.timezone) {
        $('select option[value=\'' + achievibitUser.timezone.replace(/\(.*\)\s/, '') + '\']')
          .attr('selected', 'selected');
      }

      $('select').material_select();
      $('ul.tabs').tabs();
    }

  }); // end of document ready
})(jQuery, axios, vex, firebase, _); // end of jQuery name space
