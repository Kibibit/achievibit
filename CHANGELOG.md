achievibit changelog

# [2.0.0-beta.14](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.13...v2.0.0-beta.14) (2021-04-29)


### Features

* **models:** add status to pr model ([3ca3e6e](https://github.com/Kibibit/achievibit/commit/3ca3e6e05c0bceb497b43de97b6bf9ec333c5984))
* **app:** persist pr status and delete by it in task ([067b641](https://github.com/Kibibit/achievibit/commit/067b641aa112d8f88d6b88637d2bd411a0a70735)), closes [#340](https://github.com/Kibibit/achievibit/issues/340)

# [2.0.0-beta.13](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.12...v2.0.0-beta.13) (2021-04-29)


### Features

* **tasks:** report healthchecks of cron tasks ([adcbbf2](https://github.com/Kibibit/achievibit/commit/adcbbf2037262405d01dd50aa613d00a61763687))

# [2.0.0-beta.12](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2021-04-29)


### Features

* **models:** add missing PR fields ([eb31d69](https://github.com/Kibibit/achievibit/commit/eb31d69cc69661ae5a6852b4c9aa6558aa19b0dc))
* **engine:** add pr closed handling ([4716037](https://github.com/Kibibit/achievibit/commit/4716037489b7b972b198dcc52636e4c623b87efe)), closes [#177](https://github.com/Kibibit/achievibit/issues/177)

# [2.0.0-beta.11](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2021-04-28)


### Features

* **tasks:** implement stale pr deletion from db ([36061a8](https://github.com/Kibibit/achievibit/commit/36061a87a2bac506244f3a1557650fae0a77649e))

# [2.0.0-beta.10](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.9...v2.0.0-beta.10) (2021-04-28)


### Bug Fixes

* **typegoose:** allow mixed content to disable warning ([1632445](https://github.com/Kibibit/achievibit/commit/1632445e43b770ae9b2da8032dabded33be3d3bd))


### Features

* **api:** only load pull request controller in dev environments ([11500ad](https://github.com/Kibibit/achievibit/commit/11500add6b667263e21baf395feb49196ff55dbc))

# [2.0.0-beta.9](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.8...v2.0.0-beta.9) (2021-04-27)


### Features

* **engine:** add more event handlings ([646458d](https://github.com/Kibibit/achievibit/commit/646458dfbafecce03e17d2a22409254772ab40f6))

# [2.0.0-beta.8](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2021-04-26)


### Bug Fixes

* **mongoose:** add some missing flags ([70d2e06](https://github.com/Kibibit/achievibit/commit/70d2e0685891136ccd302f388434c13c552af7f5))


### Features

* **engine:** handle assignee and reviewer events ([ae2bc97](https://github.com/Kibibit/achievibit/commit/ae2bc97932337cfdb54154cd2d77e944b5cb7d45))
* **engine:** implement label handlings ([9e42665](https://github.com/Kibibit/achievibit/commit/9e42665e145d79252df37c8f0baeb35e3fc0bdc3))
* **engine:** implement pr edit ([a3ba8d3](https://github.com/Kibibit/achievibit/commit/a3ba8d35b26969708b28ebfdf12a7412ee40d73b))

# [2.0.0-beta.7](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2021-04-25)


### Features

* **engines:** implement new connection and pr created methods ([8d68fd8](https://github.com/Kibibit/achievibit/commit/8d68fd89bb50de775222dd0dce5faa03ebab586e))

# [2.0.0-beta.6](https://github.com/Kibibit/achievibit/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2021-04-25)


### Bug Fixes

* **config:** don't allow nodeEnv in file + fix save to file ([5db8d95](https://github.com/Kibibit/achievibit/commit/5db8d951301db9d23becd7d6dd4708b3e2fd2056))
* **release:** don't run husky on release ([2ce76b5](https://github.com/Kibibit/achievibit/commit/2ce76b5ebafecd519b0d7522f74ccfe0dfc712ac))


### Features

* **config:** generate json schema from config ([b331909](https://github.com/Kibibit/achievibit/commit/b3319096bb9c635d9b14f07b256693afa74a59ca))

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
