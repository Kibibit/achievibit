import { Chance } from 'chance';
import { kebabCase, times } from 'lodash';
import { ObjectId } from 'mongodb';
import RandExp from 'randexp';

import { PullRequest, Repo, User } from '@kb-models';

type IAchievementFiles = Record<string, Record<string, unknown>>;

interface IChanceMixin {
  mongoObjectId: () => ObjectId;
  mongodbUrl: () => string;
  user: () => User;
  users: () => User[];
  repo: () => Repo;
  repos: () => Repo[];
  pullRequest: () => PullRequest;
  achievementScripts: (numOfAchievements?: number) => IAchievementFiles;
  randexp: (regex: RegExp) => RandExp;
}

const chance = new Chance() as Chance.Chance & IChanceMixin;

export const DtoMockGenerator: Chance.Chance & IChanceMixin =
  chance as Chance.Chance & IChanceMixin;

const customMixin: IChanceMixin & Chance.MixinDescriptor = {
  mongodbUrl(): string {
    return chance.url({ protocol: 'mongodb' + (chance.bool() ? '+srv' : '') });
  },
  randexp(regex: RegExp): RandExp {
    const randExp = new RandExp(regex);
    randExp.max = 10;

    return randExp;
  },
  mongoObjectId(): ObjectId {
    return new ObjectId(chance.string({
      pool: 'abcdefABCDEF123456789',
      length: 24
    }));
  },
  user(): User {
    const isOrg = chance.bool();

    return new User({
      _id: chance.mongoObjectId(),
      username: chance.name(),
      avatar: chance.url(),
      organization: isOrg,
      repos: times(chance.integer({ min: 0, max: 10 }), () => chance.animal()),
      url: chance.url(),
      users: isOrg ?
        times(chance.integer({ min: 0, max: 10 }), () => chance.animal()) :
        undefined,
      achievements: [],
      token: chance.string()
    });
  },
  users(): User[] {
    return times(chance.integer({ min: 0, max: 10 }), () => chance.user());
  },
  repo(): Repo {
    return new Repo({
      _id: chance.mongoObjectId(),
      name: chance.string(),
      fullname: chance.string(),
      organization: chance.company(),
      url: chance.url()
    });
  },
  repos(): Repo[] {
    return times(chance.integer({ min: 0, max: 10 }), () => chance.repo());
  },
  pullRequest() {
    return new PullRequest({
      createdOn: chance.date(),
      creator: chance.name(),
      description: chance.paragraph(),
      number: chance.integer(),
      prid: chance.guid(),
      url: chance.url()
    });
  },
  achievementScripts(
    numOfAchievements: number = chance.integer({ min: 1, max: 25 })
  ): IAchievementFiles {
    const scriptsObject = {};

    times(
      numOfAchievements,
      () => scriptsObject[ `${ kebabCase(chance.animal()) }.achievement` ] = {}
    );

    return scriptsObject;
  }
};

chance.mixin(customMixin);
