import Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import { ensureFileSync, readFileSync } from 'fs-extra';

export type EnvConfig = Record<string, any>;
export class ConfigService {
  private readonly mode: string = process.env.NODE_ENV || 'development';
  readonly envConfig: EnvConfig;

  get port(): number {
    return this.envConfig.PORT;
  }

  get dbUrl(): string {
    return this.envConfig.DB_URL;
  }

  constructor() {
    ensureFileSync(`${ this.mode }.env`);
    const config = dotenv.parse(readFileSync(`${ this.mode }.env`));
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production')
        .default('development'),
      PORT: Joi.number().default(10101),
      DB_URL: Joi.string()
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    );
    if (error) {
      throw new Error(`Config validation error: ${ error.message }`);
    }
    return validatedEnvConfig;
  }
}
