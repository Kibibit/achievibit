
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('/sw.js')
           .then(function() { console.log("Service Worker Registered"); });
}

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCrfu122K_PwvalttvWBtTKBdhVxxW9vrE',
  authDomain: 'achievibit-auth.firebaseapp.com',
  databaseURL: 'https://achievibit-auth.firebaseio.com',
  projectId: 'achievibit-auth',
  storageBucket: 'achievibit-auth.appspot.com',
  messagingSenderId: '544992849657'
};

firebase.initializeApp(config);

(function($, axios, vex, firebase, _, Materialize) {
  $(function() {

    if (vex) {
      vex.defaultOptions.className = 'vex-theme-default';
    }

    var CONSTS = {
      API: {
        AUTHENTICATION: '/authUsers',

      }
    };

    var achievibitRenderer = {
      userState: function(user) {
        if (!user) {
          achievibitRenderer.login();
        } else {
          achievibitRenderer.signedIn(user);
        }
      },
      signedIn: function(user) {
        var userState = $('user-state');
        var body = $('body');
        // add dropdown to body (need to delete on sign out)
        if (!$('#dropdown1').length) {
          body.append(htmlGenerator.userDropDown(user));
        }

        userState.each(function(index) {
          $(this).html(htmlGenerator
            .signedInUserState(loggedInUser, user, index));
        });

        userState.find('a.settings').click(openSettingsDialog);
        userState.find('a.logout').click(logoutUser);
        $('.dropdown-button').dropdown();
      },
      login: function() {
        var userState = $('user-state');
        userState.html(htmlGenerator.loginButton());
        userState.find('a.login').click(function() {
          authenticate();
        });
      }
    };

    var htmlGenerator = {
      loginButton: function() {
        return '<a href="#!" class="login">login</a>';
      },
      signedInUserState: function(firebaseUser, achievibitUser, index) {
        index = _.isNil(index) ? 1 : index;
        return [
          '<a class="dropdown-button" href="#!" data-beloworigin="true" ',
          'data-activates="dropdown', index, '">',
          '<img class="avatar" src="', firebaseUser.photoURL, '" alt="avatar">',
          '<span class="username">',
          achievibitUser.username, '</span>',
          '<i class="material-icons right">arrow_drop_down</i></a>',
          htmlGenerator.userDropDown(achievibitUser, index)
        ].join('');
      },
      userDropDown: function(achievibitUser, index) {
        return [
          '<ul id="dropdown', index, '" class="dropdown-content">',
          '<li><a href="/', achievibitUser.username, '">',
          '<i class="material-icons">account_circle</i>Your profile</a></li>',
          '<li class="divider"></li>',
          '<li><a href="#!" class="help">',
          '<i class="material-icons">help</i>Help</a></li>',
          '<li><a href="#!" class="settings">',
          '<i class="material-icons">settings</i>Settings</a></li>',
          '<li><a href="#!" class="logout">',
          '<i class="material-icons">power_settings_new</i>Sign out</a></li>',
          '</ul>'
        ].join('');
      },
      settings: function(achievibitUser) {
        var repoIntegration = [];
        _.forEach(achievibitUser.reposIntegration, function(repo) {
          repoIntegration.push([
            '<div class="repo-form-element" name="', repo.name, '">',
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

        return [ // should generate based on given settings
          '<nav class="nav-extended settings">',
          '<div class="nav-wrapper">',
          '<a href="#" class="brand-logo">',
          '<i class="material-icons">settings</i>Settings</a>',
          '</div>',
          '<div class="nav-content">',
          '<ul class="tabs tabs-transparent">',
          '<li class="tab"><a href="#integrations">Integrations</a></li>',
          '<li class="tab">',
          '<a class="active" href="#preferences">Preferences</a></li>',
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
          '<div class="post-achievements">',
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
        ].join('');
      }
    };

    var loggedInUser, achievibitUser, firebaseToken;
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

        loggedInUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            firebaseToken = idToken;

            // get achievibit user data
            axios.get(CONSTS.API.AUTHENTICATION, {
              params: {
                firebaseToken: firebaseToken
              }
            })
              .then(function (response) {
                // change UI based on result
                achievibitUser = response.data.achievibitUserData;
                achievibitRenderer.userState(achievibitUser);
              })
              .catch(function (error) {
                console.log(error);
              });
          });
      } else {
        loggedInUser = null;
        achievibitRenderer.userState();
      }
    });

    function authenticate() {
      isNewLogIn = true;

      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a GitHub Access Token. You can use it to access
        // the GitHub API.
        var githubToken = result.credential.accessToken;

        var githubUsername = result.additionalUserInfo.username;

        loggedInUser = result.user;

        loggedInUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            firebaseToken = idToken;

            // get achievibit user data
            axios.get(CONSTS.API.AUTHENTICATION, {
              params: {
                firebaseToken: firebaseToken,
                githubToken: githubToken,
                githubUsername: githubUsername
              }
            })
              .then(function (response) {
                // change UI based on result
                achievibitUser = response.data.achievibitUserData;
                achievibitRenderer.userState(achievibitUser);
              })
              .catch(function (error) {
                console.log(error);
              });
          });

      });
    }

    function encodeQueryData(urlBase, data) {
      var ret = [];
      for (var d in data) {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      }

      return urlBase + '?' + ret.join('&');
    }

    function logoutUser() {
      firebase.auth().signOut();
    }

    function openSettingsDialog() {
      vex.dialog.open({
        // message: 'Settings',
        input: htmlGenerator.settings(achievibitUser),
        buttons: [
          $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
          $.extend({}, vex.dialog.buttons.NO, { text: 'Discard' })
        ],
        callback: function (modalData) {
          if (!modalData) {
            // discard everything
            console.log('Settings changes discarded');
          } else {
            var newSettings = parseSettingsChanges(modalData, achievibitUser);
            axios.post(CONSTS.API.AUTHENTICATION, {
              firebaseToken: firebaseToken,
              settings: newSettings
            })
              .then(function (res) {
                achievibitUser = res.data.achievibitUserData;

                if (res.data.errors) {
                  _.forEach(res.data.errors, function(err) {
                    Materialize.toast(err, 4000);
                  });
                }
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
        $('select option[value=\'' +
          achievibitUser.timezone.replace(/\(.*\)\s/, '') + '\']')
          .attr('selected', 'selected');
      }

      $('select').material_select();
      $('ul.tabs').tabs();
    }

    function parseSettingsChanges(modalData, achievibitUser) {
      var settingsDelta = {};

      var updatedPostAchievements =
        $('.post-achievements .switch input').is(':checked');

      if (updatedPostAchievements !==
        achievibitUser.postAchievementsAsComments) {

        settingsDelta.postAchievementsAsComments = updatedPostAchievements;
      }

      var selected = $('.dropdown-content .selected').text() ||
        $('input.select-dropdown').attr('value');
      if (achievibitUser.timezone !== selected) {
        settingsDelta[setting] = selected;
      }

      var savedUserRepos =
        convertReposToHash(achievibitUser.reposIntegration);

      settingsDelta.reposIntegration = [];
      $('.repo-form-element').each(function() {
        var element = $(this);
        var name = element.attr('name');
        var integrated = $(this).find('.switch input').is(':checked');
        // check which ones were changed
        if (savedUserRepos[name].integrated !== integrated) {
          settingsDelta.reposIntegration.push({
            name: name,
            integrated: integrated
          });
        }
      });

      return settingsDelta;
    }

    function convertReposToHash(repos) {
      var repoHash = {};
      _.forEach(repos, function(repo) {
        repoHash[repo.name] = repo;
      });

      return repoHash;
    }

  }); // end of document ready
})(jQuery, axios, vex, firebase, _, Materialize); // end of jQuery name space
