WIP

<p align="center">
  <a href="https://achievibit.kibibit.io/" target="blank"><img src="http://Kibibit.io/kibibit-assets/SVG/achievibit-text.svg" width="150" alt="achievibit Logo" />
  </a>
</p>

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Build Status](https://travis-ci.org/Kibibit/achievibit-new.svg?branch=master)](https://travis-ci.org/Kibibit/achievibit-new)
[![Coverage Status](https://coveralls.io/repos/github/Kibibit/achievibit-new/badge.svg)](https://coveralls.io/github/Kibibit/achievibit-new)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6ede30ddc2d84311b420dd661aca5f4b)](https://www.codacy.com/app/neilkalman/achievibit-new?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Kibibit/achievibit-new&amp;utm_campaign=Badge_Grade)

## Description

- Get achievements on different characteristics of your pull requests
- Use the [achievibit chrome extension](https://chrome.google.com/webstore/detail/achievibit/iddkmddomdohnihbehiamfnmpomlhpee?utm_source=achievibitreadme) to see `achievibit` inside `GitHub`

## how to use

**we're working on implementing GitHub oAuth to support some extra features.**

***stay tuned***

`achievibit` needs to be integrated into each enabled repository via a **webhook**.

1. Go to your main repository page
2. click on ***Settings***
3. on the sidebar, click on ***Webhooks***
4. click on ***add webhook***
5. paste achievibit's url (`https://achievibit.kibibit.io`) into the ***payload url***
6. change ***Content type*** to `application/json`
7. on ***Which events would you like to trigger this webhook?***, select `Let me select individual events.` and check `Pull request` and `Pull request reviews`

**Maybe sometime later we'll also support repo achievements. open an issue if you're interested :-)**

## Chrome extension [![Chrome Store Version](https://img.shields.io/chrome-web-store/v/iddkmddomdohnihbehiamfnmpomlhpee.svg)](https://chrome.google.com/webstore/detail/achievibit/iddkmddomdohnihbehiamfnmpomlhpee) [![Chrome Store Downloads](https://img.shields.io/chrome-web-store/d/iddkmddomdohnihbehiamfnmpomlhpee.svg)](https://chrome.google.com/webstore/detail/achievibit/iddkmddomdohnihbehiamfnmpomlhpee)
You can install our chrome extension to see achievements in github profiles,
and see an animation everytime you get an achievement

## Add our shield to your project's README

We've just started, and we want to spread the word. We would really appreciate if you'll add our shield if you think `achievibit` is worth talking about

copy this snippet to any **markdown** file
- shield: number of achievable achievements [![Supported achievements](http://achievibit.kibibit.io/achievementsShield)](https://achievibit.kibibit.io)

```markdown
[![Supported achievements](http://achievibit.kibibit.io/achievementsShield)](https://achievibit.kibibit.io)
```

## Development

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# incremental rebuild (webpack)
$ npm run webpack
$ npm run start:hmr

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Neil Kalman](https://github.com/thatkookooguy)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Contributors

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](CONTRIBUTING.MD).

You can check out some easy to start with issues in the [Easy Pick](https://github.com/Kibibit/achievibit/labels/Easy%20Pick).

## Contributor Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md).

By participating in this project you agree to abide by its terms.

## License

[MIT License](LICENSE)

Copyright (c) 2018 Neil Kalman &lt;neilkalman@gmail.com&gt;
