import { UserDto } from '@kb-models/user.model';
import { ClassSerializerInterceptor, Controller, Get, HttpStatus, Param, Render, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('api/users')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
    isArray: true,
    description: 'returns all existing users'
  })
  async getAllUsers(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get('/:username')
  @ApiOperation({ summary: 'Get the user profile page in HTML' })
  @Render('user-profile')
  async getUser(@Param('username') username: string): Promise<{ user: UserDto, achievements: any[] }> {
    const user = await this.usersService.findOne(username);

    return { user, achievements: user.achievements };
  }

  @Get('/:username/raw')
  @ApiOperation({ summary: 'Get a user by username as JSON' })
  async getRawUser(@Param('username') username): Promise<UserDto> {
    return this.usersService.findOne(username);
  }
}
