# [2.0.0-beta.5](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2021-04-24)


### Features

* **config:** add config module to handle global configurations ([64ad998](https://github.com/Kibibit/achievibit/commit/64ad9982c82a07b2aff78cd873f0b474c63e2d8a))

# [2.0.0-beta.4](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2021-04-21)


### Features

* **achievements:** integrate achievements into server and build ([307121b](https://github.com/Kibibit/achievibit/commit/307121b46709f5d63fb93c2df7a04ac979bfa85b))
* **achievements:** update achievements to version 2 ([6849e64](https://github.com/Kibibit/achievibit/commit/6849e644327db9e80bb989af6f93ad45eee0b569))

# [2.0.0-beta.3](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2021-04-20)


### Bug Fixes

* **tests:** add missing database connection closer ([aaff01f](https://github.com/Kibibit/achievibit/commit/aaff01f8c1d52075648fbc9a44a5128d2297b7d0))

# [2.0.0-beta.2](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2021-04-20)


### Bug Fixes

* **deps:** include nest cli as dev dependency ([db36678](https://github.com/Kibibit/achievibit/commit/db366787dbe2a4105f07f3287350543dd2f5a23c))


### Features

* **models:** add indexes and uniqueness to db ([5da80ff](https://github.com/Kibibit/achievibit/commit/5da80ffcecd10df26d4cf737391e28dec920c9b0))
* **api:** add webhook manager and pull request model ([11f138a](https://github.com/Kibibit/achievibit/commit/11f138a6fc03eb3eeacd16424cfd8b22627d09e7))
* **engines:** implement abstract engine and add pr model ([00c0aaf](https://github.com/Kibibit/achievibit/commit/00c0aaf3686b4332658b12a1f9efccb535794027))
* **engines:** initialize github engine ([4a6c4cc](https://github.com/Kibibit/achievibit/commit/4a6c4cc385459aaf6ec01a3893ede566f3646a91))

# [2.0.0-beta.1](https://github.com/Kibibit/achievibit/compare/v1.1.0...v2.0.0-beta.1) (2021-04-18)


### Bug Fixes

* **app:** small nits: fix plural and hide warning ([d3cdfdc](https://github.com/Kibibit/achievibit/commit/d3cdfdcba909e2679d00872210ffd49ef1195430))


### Features

* **api:** add user and repo controllers ([298c4bf](https://github.com/Kibibit/achievibit/commit/298c4bf053af56af48d8dd9270d248760e302662))
* **models:** add user and repo models ([5278b84](https://github.com/Kibibit/achievibit/commit/5278b849a565856d82c824421f71516c9019b96f))
* **app:** small nits across the app ([7992c4b](https://github.com/Kibibit/achievibit/commit/7992c4b559c92f271605883cea1a694f2af8a65d))
* **release:** start releasing a beta version ([1abfec7](https://github.com/Kibibit/achievibit/commit/1abfec710b52b1f5303470aac5ee3f6e00995922))
* **github-actions:** try caching ~/.npm ([f5d99c5](https://github.com/Kibibit/achievibit/commit/f5d99c5819ca78a9e3db40327d4986a0456b8661))


### ref

* **init:** make room for 2nd version ([35c7b2c](https://github.com/Kibibit/achievibit/commit/35c7b2c56ce500e600fde377bc3ac40e6c5da13e))


### BREAKING CHANGES

* **init:** From this point on, the application is going to work differently, so this is definitely a breaking change that should start the 2nd version. Even after feature parity, the structure will be different in this new version (api route moves, client side will be fancier, etc.).
