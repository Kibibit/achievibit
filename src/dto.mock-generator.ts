import { Chance } from 'chance';
import { kebabCase, times } from 'lodash';
import RandExp from 'randexp';

import { RepoDto, UserDto } from '@kb-models';

interface IChanceMixin {
  mongoObjectId: () => string;
  mongodbUrl: () => string;
  userDto: () => UserDto;
  userDtos: () => UserDto[];
  repoDto: () => RepoDto;
  repoDtos: () => RepoDto[];
  achievementScripts: (numOfAchievements?: number) => { [ key: string ]: {} };
  randexp: (regex: RegExp) => RandExp;
}

const chance = new Chance() as Chance.Chance & IChanceMixin;

export const dtoMockGenerator: Chance.Chance & IChanceMixin = chance as Chance.Chance & IChanceMixin;

const customMixin: IChanceMixin & Chance.MixinDescriptor = {
  mongodbUrl(): string {
    return chance.url({ protocol: 'mongodb' + (chance.bool() ? '+srv' : '') });
  },
  randexp(regex: RegExp): RandExp {
    const randExp = new RandExp(regex);
    randExp.max = 10;

    return randExp;
  },
  mongoObjectId(): string {
    return chance.string({ pool: 'abcdefABCDEF123456789', length: 24 });
  },
  userDto(): UserDto {
    const isOrg = chance.bool();

    return {
      _id: chance.mongoObjectId(),
      __v: '0',
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
    };
  },
  userDtos(): UserDto[] {
    return times(chance.integer({ min: 0, max: 10 }), () => chance.userDto());
  },
  repoDto(): RepoDto {
    return {
      _id: chance.mongoObjectId(),
      __v: 0,
      name: chance.string(),
      fullname: chance.string(),
      organization: chance.company(),
      url: chance.url()
    };
  },
  repoDtos(): RepoDto[] {
    return times(chance.integer({ min: 0, max: 10 }), () => chance.repoDto());
  },
  achievementScripts(numOfAchievements: number = chance.integer({ min: 1, max: 25 })): { [ key: string ]: {} } {
    const scriptsObject = {};

    times(numOfAchievements, () => scriptsObject[ `${ kebabCase(chance.animal()) }.achievement` ] = {});

    return scriptsObject;
  }
};

chance.mixin(customMixin);
