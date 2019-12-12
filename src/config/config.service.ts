import Joi from '@hapi/joi';
import * as dotenv from 'dotenv';
import { ensureFileSync, readFileSync } from 'fs-extra';
import SmeeClient from 'smee-client';
import { dtoMockGenerator } from 'src/dto.mock-generator';
import { Logger } from '@nestjs/common';

const environment = process.env.NODE_ENV || 'development';

const eventLogger: Logger = new Logger('SmeeEvents');

(eventLogger as any).info = eventLogger.log;

let smee: SmeeClient;

let events: any;

export type EnvConfig = Record<string, any>;
export class ConfigService {
  private readonly logger: Logger = new Logger('ConfigService');

  private readonly mode: string = environment;
  readonly envConfig: EnvConfig;

  get smee(): SmeeClient {
    return smee;
  }

  get events(): any {
    return events;
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  get dbUrl(): string {
    return this.envConfig.DB_URL;
  }

  get webhookProxyUrl(): string {
    return this.envConfig.WEBHOOK_PROXY_URL;
  }

  get webhookDestinationUrl(): string {
    return this.envConfig.WEBHOOK_DESTINATION_URL;
  }

  constructor() {
    ensureFileSync(`${ this.mode }.env`);
    const config = dotenv.parse(readFileSync(`${ this.mode }.env`));
    this.envConfig = this.validateInput(config);

    if (environment === 'development') {
      if (!smee) {
        smee = new SmeeClient({
          source: this.webhookProxyUrl,
          target: `http://localhost:${ this.port }/${ this.webhookDestinationUrl }`,
          logger: eventLogger
        });
      }

      if (!events) {
        this.logger.log('Starting to listen to events from Proxy');
        events = this.smee.start();
      }
    }
  }

  closeEvents() {
    return this.events && this.events.close();
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi
        .string()
        .valid('development', 'production')
        .default('development'),
      PORT: Joi
        .number()
        .default(10101),
      DB_URL: Joi.string(),
      WEBHOOK_PROXY_URL: Joi
        .string()
        .uri({ scheme: 'https' })
        .regex(/^https:\/\/(?:www.)?smee\.io\//, 'https://smee.io/<sub_path> url')
        .default(`https://smee.io/achievibit-${ dtoMockGenerator.guid() }`),
      WEBHOOK_DESTINATION_URL: Joi
        .string()
        .regex(/^([\w]+)?(\/[\w-]+)*$/, `PATH-NAME (for example: 'hello/world')`)
        .replace(/^\//, '')
        .trim()
        .default(`events`)
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig
    );
    if (error) {
      // this.logger.error(`Config validation error: ${ error.message }`);
      throw new Error(`Config validation error: ${ error.message }`);
    }
    return validatedEnvConfig;
  }
}
