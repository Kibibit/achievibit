import { Exclude, Expose } from 'class-transformer';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Validate
} from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { v1 as uuidv1 } from 'uuid';

import { JsonSchema } from './json-schema.validator';

export const NODE_ENVIRONMENT_OPTIONS = [
  'development',
  'production',
  'test',
  'devcontainer'
];
export const SMEE_IO_REGEX = /^https:\/\/(?:www\.)?smee\.io\/[a-zA-Z0-9_-]+\/?/;
export const ENDPONT_PATH_REGEX = /^([\w]+)?(\/[\w-]+)*$/;

@Exclude()
export class AchievibitConfig {
  @Expose()
  @IsString()
  @IsIn(NODE_ENVIRONMENT_OPTIONS)
  @Validate(JsonSchema, [
    'Tells which env file to use'
  ])
  nodeEnv = 'development';

  @Expose()
  @IsNumber()
  @Validate(JsonSchema, [
    'Set server port'
  ])
  port = 10101;

  @Expose()
  @IsOptional()
  @IsString()
  @IsUrl({ protocols: [ 'mongodb', 'mongodb+srv' ], require_tld: false }, {
    message: '$property should be a valid mongodb URL'
  })
  @Validate(JsonSchema, [
    'DB connection URL. Expects a mongodb db for connections'
  ])
  dbUrl: string;

  @Expose()
  @Matches(SMEE_IO_REGEX)
  @IsUrl()
  @Validate(JsonSchema, [
    'Used to create a custom repeatable smee webhook url instead of ',
    'Generating a random one'
  ])
  webhookProxyUrl = `https://smee.io/achievibit-${ uuidv1() }`;

  @Expose()
  @Matches(ENDPONT_PATH_REGEX)
  @Validate(JsonSchema, [
    'proxy should sent events to this url for achievibit'
  ])
  // @Transform((url) => trim(url as any, '/'))
  webhookDestinationUrl = 'events';

  @IsBoolean()
  @Validate(JsonSchema, [
    'Create a file made out of the internal config. This is mostly for ',
    'merging command line, environment, and file variables to a single instance'
  ])
  saveToFile = false;

  constructor(partial: Partial<AchievibitConfig> = {}) {
    Object.assign(this, partial);
  }

  toJsonSchema() {
    const configJsonSchema = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      additionalConverters: {
        JsonSchema: (meta) => ({
            description: meta.constraints.join('')
        })
      }
    }).AchievibitConfig;

    delete configJsonSchema.properties.nodeEnv;
    configJsonSchema.required.splice(
      configJsonSchema.required.indexOf('nodeEnv'),
      1
    );

    // console.log(configJsonSchema);

    return configJsonSchema;
  }
}
