## Run Locally and test achievements

to test your achievements locally, do the following:

1. clone achievibit locally
2. run `npm install` to install all dependencies
3. you need to supply a database link in [`achievibitDB.js`](https://github.com/Kibibit/achievibit/blob/master/achievibitDB.js#L5) and [`index.js`](https://github.com/Kibibit/achievibit/blob/master/index.js#L20)
4. you need to supply a `ngrok` token to be able to connect your local achievibit as a repository webhook in [`index.js`](https://github.com/Kibibit/achievibit/blob/master/index.js#L30)
5. connect your local achievibit with a test repository as detailed in `README.MD`, but use your ngrok url instead. Check that the achievement works on your database (your user got your achievement on your test repository).
if your achievement requires interaction with another user, talk to one of the developers and we'll help test it (reviewing a test pull request, etc.).


you can create a `mlab` database for tests at [mlab site](https://mlab.com) or any other mongoDB system.
