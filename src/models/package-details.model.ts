import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Exclude()
export class PackageDetailsDto {
  constructor(partial: Partial<PackageDetailsDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  version: string;

  @Expose()
  @ApiPropertyOptional()
  description: string;

  @Expose()
  @ApiPropertyOptional()
  author: string;

  @Expose()
  @ApiPropertyOptional()
  license: string;

  @Expose()
  @ApiPropertyOptional()
  keywords: string[];

  @Expose()
  @ApiPropertyOptional()
  contributors: Array<string | { name: string; email: string; url: string; }>;

  @Expose()
  @ApiPropertyOptional()
  bugs: string;

  @Expose()
  @ApiPropertyOptional()
  homepage: string;

  @Expose()
  @ApiPropertyOptional()
  repository: string | { type: string; url: string; };

  @Expose()
  @ApiPropertyOptional()
  engines: { [ key: string ]: string; };

  @Expose()
  @ApiPropertyOptional()
  browserslist: string[];
}
