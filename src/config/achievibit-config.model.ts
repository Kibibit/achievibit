import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { trim } from 'lodash';

import { dtoMockGenerator } from '../dto.mock-generator';

export const NODE_ENVIRONMENT_OPTIONS = [ 'development', 'production', 'test' ];
export const SMEE_IO_REGEX = /^https:\/\/(?:www\.)?smee\.io\/[a-zA-Z0-9_-]+\/?/;
export const ENDPONT_PATH_REGEX = /^([\w]+)?(\/[\w-]+)*$/;

@Exclude()
export class AchievibitConfig {
  @Expose()
  @IsString()
  @IsIn(NODE_ENVIRONMENT_OPTIONS)
  nodeEnv = 'development';

  @Expose()
  @IsNumber()
  port = 10101;

  @Expose()
  @IsOptional()
  @IsString()
  @IsUrl({ protocols: [ 'mongodb', 'mongodb+srv' ] }, {
    message: '$property should be a valid mongodb URL'
  })
  dbUrl: string;

  @Expose()
  @Matches(SMEE_IO_REGEX)
  @IsUrl()
  webhookProxyUrl = `https://smee.io/achievibit-${ dtoMockGenerator.guid() }`;

  @Expose()
  @Matches(ENDPONT_PATH_REGEX, null, {
    message: 'should be a server endpoint path matching the regex: $constraint1'
  })
  @Transform((url) => trim(url, '/'))
  webhookDestinationUrl = 'events';

  @Expose()
  @IsBoolean()
  saveToFile = false;

  constructor(partial: Partial<AchievibitConfig> = {}) {
    Object.assign(this, partial);
  }
}
