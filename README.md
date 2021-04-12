<p align="center">
  <a href="https://achievibit.kibibit.io/" target="blank"><img src="http://Kibibit.io/kibibit-assets/SVG/achievibit-text.svg" width="150" alt="achievibit Logo" />
  </a>
  <h2 align="center">
    @kibibit/achievibit
  </h2>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@kibibit/achievibit"><img src="https://img.shields.io/npm/v/@kibibit/achievibit/latest.svg?style=for-the-badge&logo=npm&color=CB3837"></a>
</p>
<p align="center">
<a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg"></a>
<a href="https://github.com/Kibibit/achievibit/actions/workflows/server-unit-tests.yml">
  <img src="https://github.com/Kibibit/achievibit/actions/workflows/server-unit-tests.yml/badge.svg?style=flat-square" alt="Server Unit Tests">
</a>
<a href="https://github.com/Kibibit/achievibit/actions/workflows/client-unit-tests.yml">
  <img src="https://github.com/Kibibit/achievibit/actions/workflows/client-unit-tests.yml/badge.svg?style=flat-square" alt="Client Unit Tests">
</a>
<a href="https://github.com/Kibibit/achievibit/actions/workflows/api-tests.yml">
  <img src="https://github.com/Kibibit/achievibit/actions/workflows/api-tests.yml/badge.svg?style=flat-square" alt="API Tests">
</a>
<a href="https://github.com/Kibibit/achievibit/actions/workflows/e2e-tests.yml">
  <img src="https://github.com/Kibibit/achievibit/actions/workflows/e2e-tests.yml/badge.svg?style=flat-square" alt="E2E Tests">
</a>
 <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors-"><img src="https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square" alt="All Contributors"></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
</p>
<p align="center">
  Github Gamification - Achievements system as a GitHub WebHook.
</p>
<hr>

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://thatkookooguy.kibibit.io/"><img src="https://avatars3.githubusercontent.com/u/10427304?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Neil Kalman</b></sub></a><br /><a href="https://github.com/Kibibit/achievibit/commits?author=Thatkookooguy" title="Code">💻</a> <a href="https://github.com/Kibibit/achievibit/commits?author=Thatkookooguy" title="Documentation">📖</a> <a href="#design-Thatkookooguy" title="Design">🎨</a> <a href="#maintenance-Thatkookooguy" title="Maintenance">🚧</a> <a href="#infra-Thatkookooguy" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Kibibit/achievibit/commits?author=Thatkookooguy" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

## Stay in touch

- Author - [Neil Kalman](https://github.com/thatkookooguy)
- Website - [https://github.com/kibibit](https://github.com/kibibit)
- StackOverflow - [thatkookooguy](https://stackoverflow.com/users/1788884/thatkookooguy)
- Twitter - [@thatkookooguy](https://twitter.com/thatkookooguy)
- Twitter - [@kibibit_opensrc](https://twitter.com/kibibit_opensrc)
