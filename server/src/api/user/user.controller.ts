import {
  Controller,
  Logger,
  NotFoundException,
  Param,
  UseFilters
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetAll, GetOne } from '@kb-decorators';
import { KbValidationExceptionFilter } from '@kb-filters';
import { User } from '@kb-models';

import { UserService } from './user.service';

@Controller('api/user')
@ApiTags('user')
@UseFilters(new KbValidationExceptionFilter())
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @GetAll(User)
  async getAllUsers() {
    const users = await this.userService.findAllUsers();

    return users;
  }

  @GetOne(User, ':username')
  async getUser(@Param('username') username: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User with username ${ username } not found`);
    }

    // will show secret fields as well!
    this.logger.log('Full User');
    // will log only public fields!
    this.logger.log(user);
    // DANGER! WILL LOG EVERYTHING!
    // console.log(user);

    // will only include exposed fields
    return user;
  }
}
