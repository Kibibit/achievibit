var githubhook = require('githubhook');
var githubEvents = githubhook({/* options */});
var github = require('octonode');

//var ghrepo = client.repo('pksunkara/hub');

// ghrepo.status('18e129c213848c7f239b93fe5c67971a64f183ff', {
//   "state": "success",
//   "target_url": "http://ci.mycompany.com/job/hub/3",
//   "description": "Achievement UNLOCKED: implementing achievment system"
// }, function() {
// 	console.log('status added successfully!');
// });

githubEvents.listen();


githubEvents.on('*', function (event, repo, ref, data) {
	console.log(data);
});

githubEvents.on('event', function (repo, ref, data) {
	console.log(data);
});

githubEvents.on('event:kibibit/kibibit-code-editor', function (ref, data) {
	console.log(data);
});

githubEvents.on('event:kibibit/kibibit-code-editor:ref', function (data) {
	console.log(data);
});

githubEvents.on('kibibit/kibibit-code-editor', function (event, ref, data) {
	console.log(data);
});

githubEvents.on('kibibit/kibibit-code-editor:ref', function (event, data) {
	console.log(data);
});
