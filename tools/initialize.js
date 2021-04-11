const { terminalConsoleLogo } = require('@kibibit/consologo');
const inquirer = require('inquirer');
const Foswig = require('foswig').default;
const Sentencer = require('sentencer');
const Names = require('./data/names-dictionary');
const { kebabCase, toLower } = require('lodash');
const packageNameRegex = require('package-name-regex');
// const imageToAscii = require('image-to-ascii');

//load the words into the markov chain
const chain = new Foswig(3, Names.dictionary);

// imageToAscii("https://octodex.github.com/images/octofez.png", (err, converted) => {
//     console.log(err || converted);
// });

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'What is the name of this new project?',
    transformer(input) { return `@kibibit/${ input }`; },
    validate(input) {
      return packageNameRegex.test(input) || `@kibibit/${ input } is not a valid NPM package name`;
    },
    default: '@kibibit/' + toLower(chain.generate({
      minLength: 5,
      maxLength: 10,
      allowDuplicates: false
    }))
  },
  {
    type: 'input',
    name: 'projectDescription',
    message: 'Please write a short description for this project',
    default: Sentencer.make('This is {{ an_adjective }} {{ noun }}.')
  },
  {
    type: 'input',
    name: 'author',
    message: 'Project owner\\author',
    default: 'githubusername <me@email.com>'
  },
  {
    type: 'input',
    name: 'githubRepo',
    message: 'Paste a url to a github repo or a user/repo pair',
    default: 'kibibit/achievibit'
  }
];

(async () => {
  terminalConsoleLogo('Start a new project', 'Answer these questions to start a new project');
  const answers = await inquirer.prompt(questions);

  answers.projectName = answers.projectName.startsWith('@kibibit/') ?
    answers.projectName : `@kibibit/${ answers.projectName }`;

  answers.projectNameSafe = kebabCase(answers.projectName);

  console.log(answers);
})();