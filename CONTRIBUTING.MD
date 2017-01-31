# Welcome!

We're so glad you're thinking about contributing to a `kibibit` open source project! If you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contribution, and don't want a wall of rules to get in the way of that.

Before contributing, we encourage you to read our **CONTRIBUTING** policy **(you are here)**, our **[LICENSE](LICENSE)**, our **[CODE OF CONDUCT](CODE_OF_CONDUCT.md)**, and our **[README](README.MD)**, all of which should be in this repository.

# Easy starting point
Our list of [Easy Picks](https://github.com/Kibibit/achievibit/labels/Easy%20Pick) include specific issues that are a good starting point for new contributors.

These are **easy to pick up tasks**, either because they are small in scope, or just don't involve much in-depth knowledge of the project.

Based on [Jordi Boggiano](https://github.com/Seldaek)'s [blog post](https://seld.be/notes/encouraging-contributions-with-the-easy-pick-label)

# Run Locally and test achievements

To test your achievements locally, you need do the following:

## Prerequisites
1. Creating a `MongoDB` database. You can use https://mlab.com/ to create one in the cloud.
If you're using `mlab`, you need to create a database, and then create a database user.
After creating a database, click on Users**-->**Add database user
![Users-->Add database user](/screenshots/create-db-user.png)
Now, go to your database homepage, and copy the database url. you need to enter your database username and password (**NOT YOUR MLAB ACCOUNT!**)
![mongodb url](/screenshots/mongodb-url.png)

2. Create an account at https://ngrok.com/ so you can connect your local server to a **GitHub Repository**
> you'll need the **ngrok token**:
![ngrok token](/screenshots/ngrok-token.png)

## Getting started

1. clone achievibit locally (we prefer using [ungit](https://github.com/FredrikNoren/ungit))
2. run `npm install` to install all dependencies
3. run the following command, replacing all the urls we got in the **prerequisites** step `node index.js --databaseUrl "<mongodb-url>" --ngrokToken "<ngrok-token>"`
>You can also set global variables with the same names to set those permenantly. In Unixy environments: `export ngrokToken="<ngrok-token>"` || In Windows **powershell**: `$env:ngrokToken="<ngrok-token>"`

4. if everything worked, you should see the `achievibit` logo, and an **ngrok url** under it.
5. follow the instructions in the [`README.MD`](/README.MD) file to connect a test repository to your local achievibit (replace the url with your ngrok url). Make sure **Content type** is set to **application\json**
> ![connect repo](/screenshots/connect-to-repo.png)

6. check that the achievement works on your database (your user got your achievement on your test repository).
if your achievement requires interaction with another user, talk to one of the developers and we'll help test it (reviewing a test pull request, etc.).

# Seeing logs
Other then seeing the **logs** in your `console`, you can access your logs from anywhere on `<ngrok_url>/logs`.
See [Supported Params](#supported-params) for more info

# Supported params
`achievibit` supports the following params:
- `--databaseUrl` (required)
- `--ngrokToken` (required)
- `--logsUsername` - set a username to the logs
- `--logsPassword` - set a password to the logs (without the username, this is ignored)
- `--stealth` - if you don't want to print the logo in the terminal
- `--githubUser` - `GitHub` user to make requests with
- `--githubPassword` - `GitHub` password to make requests with

# Running tests (WIP)

`gulp test` will run
- unit tests
- REST-interface tests
- clicktests.

`gulp test:unittest` only runs the tests in the test/ folder, `gulp test:clicktest` runs only the tests in the clicktests/ folder. Install mocha (`npm install -g mocha`) to run specific tests in the test folder and get better stack traces: `mocha test/spec.git-api.js`.
