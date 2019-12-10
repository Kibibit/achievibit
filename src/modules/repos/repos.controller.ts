import { RepoDto } from '@kb-models/repo.model';
import { ClassSerializerInterceptor, Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ReposService } from './repos.service';

@Controller('api/repos')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Repos')
export class ReposController {
  private logger: Logger = new Logger('ReposController');

  constructor(private readonly reposService: ReposService) { }

  @Get()
  @ApiOperation({ summary: 'Get all repos' })
  async getAllRepos(): Promise<RepoDto[]> {
    return this.reposService.findAll();
  }

  // @Post()
  // @ApiOperation({ summary: 'Create a repo' })
  // async create(@Body() createUserDto: CreateRepoDto): Promise<RepoDto> {
  //   return this.reposService.create(createUserDto)
  //     .catch((err) => {
  //       this.logger.error(err);

  //       if (err && err.errmsg && err.keyValue) {
  //         throw new HttpException(
  //           `Seems like an item with ${ JSON.stringify(err.keyValue) } already exists`,
  //           HttpStatus.UNPROCESSABLE_ENTITY
  //         );
  //       }

  //       throw err;
  //     });
  // }
}
