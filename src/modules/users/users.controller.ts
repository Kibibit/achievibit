import { UserDto } from '@kb-models/user.model';
import { ClassSerializerInterceptor, Controller, Get, HttpStatus, Param, Render, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
    isArray: true,
    description: 'returns all existing users'
  })
  async getAllUsers(): Promise<UserDto[]> {
    return [];
  }

  @Get('/:username')
  @ApiOperation({ summary: 'Get the user profile page in HTML' })
  @Render('user-profile')
  @UseInterceptors(ClassSerializerInterceptor)
  async getUser(@Param('username') username: string): Promise<{ user: UserDto, achievements: any[] }> {
    return { user: new UserDto({ username }), achievements: [] };
  }

  @Get('/:username/raw')
  @ApiOperation({ summary: 'Get a user by username as JSON' })
  @UseInterceptors(ClassSerializerInterceptor)
  async getRawUser(@Param('username') username): Promise<UserDto> {
    return new UserDto({ username });
  }
}