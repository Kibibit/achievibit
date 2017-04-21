## achievibit
<img src="https://achievibit.herokuapp.com/images/favicon.png" width="150">

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Supported achievements](http://achievibit.herokuapp.com/achievementsShield)](https://achievibit.herokuapp.com) [![Coverage Status](https://coveralls.io/repos/github/Kibibit/achievibit/badge.svg?branch=master)](https://coveralls.io/github/Kibibit/achievibit?branch=master)

------
- Achievements system as a `GitHub` WebHook.
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
5. paste achievibit's url (`http://achievibit.herokuapp.com`) into the ***payload url***
6. change ***Content type*** to `application/json`
7. on ***Which events would you like to trigger this webhook?***, select `Let me select individual events.` and check `Pull request`

**Maybe sometime later we'll also support repo achievements. open an issue if you're interested :-)**

## Chrome extension [![Chrome Store Version](https://img.shields.io/chrome-web-store/v/iddkmddomdohnihbehiamfnmpomlhpee.svg)](https://chrome.google.com/webstore/detail/achievibit/iddkmddomdohnihbehiamfnmpomlhpee) [![Chrome Store Downloads](https://img.shields.io/chrome-web-store/d/iddkmddomdohnihbehiamfnmpomlhpee.svg)](https://chrome.google.com/webstore/detail/achievibit/iddkmddomdohnihbehiamfnmpomlhpee)
You can install our chrome extension to see achievements in github profiles,
and see an animation everytime you get an achievement

## Add our shield to your project's README

We've just started, and we want to spread the word. We would really appreciate if you'll add our shield if you think `achievibit` is worth talking about

copy this snippet to any **markdown** file
- shield: number of achievable achievements [![Supported achievements](http://achievibit.herokuapp.com/achievementsShield)](https://achievibit.herokuapp.com)

  ```markdown
[![Supported achievements](http://achievibit.herokuapp.com/achievementsShield)](https://achievibit.herokuapp.com)
```

## Contributors

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](CONTRIBUTING.MD).

You can check out some easy to start with issues in the [Easy Pick](https://github.com/Kibibit/achievibit/labels/Easy%20Pick).

## Contributor Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md).

By participating in this project you agree to abide by its terms.

## License

[MIT License](LICENSE)

Copyright (c) 2017 Neil Kalman &lt;neilkalman@gmail.com&gt;
