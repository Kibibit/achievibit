import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { trim } from 'lodash';

import { dtoMockGenerator } from '../dto.mock-generator';

const nodeEnvOptions = [ 'development', 'production', 'test' ];

@Exclude()
export class AchievibitConfig {
  @Expose()
  @IsString()
  @IsIn(nodeEnvOptions)
  nodeEnv = 'development';

  @Expose()
  @IsNumber()
  port = 10101;

  @Expose()
  @IsOptional()
  dbUrl: string;

  @Expose()
  @Matches(/^https:\/\/(?:www.)?smee\.io\//)
  webhookProxyUrl = `https://smee.io/achievibit-${ dtoMockGenerator.guid() }`;

  @Expose()
  @Matches(/^([\w]+)?(\/[\w-]+)*$/, null, {
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
