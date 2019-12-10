import { Chance } from 'chance';
import { times } from 'lodash';

import { UserDto } from './models/user.model';

interface IChanceMixin {
  mongoObjectId: () => string;
  userDto: () => UserDto;
  userDtos: () => UserDto[];
}

const chance = new Chance() as Chance.Chance & IChanceMixin;

export const dtoMockGenerator: Chance.Chance & IChanceMixin = chance as Chance.Chance & IChanceMixin;

const customMixin: IChanceMixin & Chance.MixinDescriptor = {
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
      achievements: []
    };
  },
  userDtos(): UserDto[] {
    return times(chance.integer({ min: 0, max: 10 }), () => chance.userDto());
  }
};

chance.mixin(customMixin);
