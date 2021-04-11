# Template Usage Overview

## Starting Up

### Prequisits
- [vscode](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/) (**OPTIONAL**)

### Install the repo
1. On your local computer, copy the repo using `git clone`
2. Open the repository in vscode.
3. you can work in the following modes:
   - **[Devcontainer](https://code.visualstudio.com/docs/remote/containers)** - Create a docker container that runs the app with all the tools and extensions necassery. vscode will popup a notification to ask you if it should re-open the project inside a devcontainer. This will also start a mongodb database for the app to use against
   - **open locally** - run the repo locally. Should work but you might have some OS differences at edge-cases. You will need to provice a mongodb database link for the app to work against a database.
4. Open a terminal and run `npm install` inside the main folder. This will install all dependencies.

### Rename to your project name
After the dependencies are installed, you need to change the project name from `kb-server-client-template` to whatever project you're developing. In order to do that, you can run:
```
npm run init <your-project-name>
```
This will replace the important parts of the templates to your project name (which should be npm compliant).

## Run in Development mode

### Server
In the main repo folder, run `npm run start:server` to start the server
in watch mode. The server will be available at `localhost:10102`.

API swagger documentation is available at `localhost:10102/api/docs` (or through the client proxy).

A `Product` module is included as an example for a full module\service\controller feature with db.

### Client
In the main repo folder, run `npm run start:client` to start the client in local proxy mode. The client will be available at `localhost:10101`. This will re-route all rest calls to
`localhost:10101/api` to the server application running on `localhost:10102`.

## Run Production App
In the main repo folder, run the following commands
```
npm run build
node .
```

## Run tests

### Server Unit-Tests
In vscode, at the footer, click on `TESTS: Server Unit-tests and Coverage` or run `npm run test:server-unit`
### Client Unit-tests
In vscode, at the footer, click on `TESTS: Client Unit-tests and Coverage` or run `npm run test:client-unit`
### API Tests
In vscode, at the footer, click on `TESTS: API-tests` or run `npm run test:api`
### E2E Tests
In vscode, at the footer, click on `TESTS: E2E-tests` or run `npm run test:e2e`