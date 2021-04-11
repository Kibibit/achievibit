import { ApiProperty } from '@nestjs/swagger';

export class ApiInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
  
  @ApiProperty()
  version: string;

  @ApiProperty()
  license: string;

  @ApiProperty()
  repository: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  bugs: string;

  constructor(partial: Partial<ApiInfo> = {}) {
    Object.assign(this, partial);
  }
}
