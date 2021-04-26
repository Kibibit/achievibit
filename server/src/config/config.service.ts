import { Logger } from '@nestjs/common';
import { classToPlain, Exclude } from 'class-transformer';
import { validateSync } from 'class-validator';
import findRoot from 'find-root';
import {
  pathExistsSync,
  readJSONSync,
  writeJson,
  writeJSONSync
} from 'fs-extra';
import { camelCase, get } from 'lodash';
import nconf from 'nconf';
import { join } from 'path';
import SmeeClient from 'smee-client';

import { ConfigValidationError } from '@kb-errors';
import { ApiInfo } from '@kb-models';

import { AchievibitConfig } from './achievibit-config.model';

const appRoot = findRoot(__dirname, (dir) => {
  const packagePath = join(dir, 'package.json');
  const isPackageJsonExists = pathExistsSync(packagePath);

  if (isPackageJsonExists) {
    const packageContent = readJSONSync(packagePath, { encoding: 'utf8' });
    if (['server', 'client'].indexOf(packageContent.name) < 0) {
      return true;
    }
  }

  return false;
});
const environment = get(process, 'env.NODE_ENV', 'development');
const eventLogger: Logger = new Logger('SmeeEvents');
(eventLogger as any).info = eventLogger.log;
const configFilePath = join(appRoot, `${ environment }.env.json`);

const packageDetails = new ApiInfo(readJSONSync(join(appRoot, 'package.json')));

nconf
  .argv({
    parseValues: true
  })
  .env({
    lowerCase: true,
    parseValues: true,
    transform: transformToLowerCase
  })
  .file({ file: configFilePath });

let smee: SmeeClient;
let events: any;
let configService: ConfigService;

/**
 * This is a **Forced Singleton**.
 * This means that even if you try to create
 * another ConfigService, you'll always get the
 * first one.
 */
@Exclude()
export class ConfigService extends AchievibitConfig {
  private logger: Logger = new Logger('ConfigService');

  private readonly mode: string = environment;

  get smee(): SmeeClient {
    return smee;
  }

  get events(): any {
    return events;
  }

  get packageDetails(): any {
    return packageDetails;
  }

  get appRoot(): string {
    return appRoot;
  }

  constructor(passedConfig?: Partial<AchievibitConfig>) {
    super();
    if (!passedConfig && configService) { return configService; }

    const config = passedConfig || nconf.get();
    const envConfig = this.validateInput(config);
    const passedConfigNodeEnv = get(passedConfig, 'nodeEnv', '');

    // attach configuration to this service
    Object.assign(this, envConfig);

    const smeeEnvironments = [
      'development',
      'devcontainer'
    ];
    if (smeeEnvironments.includes(this.mode) ||
      smeeEnvironments.includes(passedConfigNodeEnv)) {
      if (!smee) {
        smee = new SmeeClient({
          source: this.webhookProxyUrl,
          target:
            `http://localhost:${ this.port }/${ this.webhookDestinationUrl }`,
          logger: eventLogger as any
        });
      }

      if (!events) {
        this.logger.log('Starting to listen to events from Proxy');
        events = this.smee.start();
      }
    } else {
      this.closeEvents();

      smee = undefined;
      events = undefined;
    }

    if (config.saveToFile) {
      writeJson(configFilePath, classToPlain(this), { spaces: 2 });
    }

    const schema = this.toJsonSchema();
    writeJSONSync(join(this.appRoot, 'env.schema.json'), schema);

    configService = this;
  }

  closeEvents() {
    const eventsToDelete = events;

    smee = undefined;
    events = undefined;

    return eventsToDelete && eventsToDelete.close();
  }

  toPlainObject() {
    return classToPlain(this);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(
    envConfig: Record<string, any>
  ): Partial<AchievibitConfig> {
    const achievibitConfig = new AchievibitConfig(envConfig);
    const validationErrors = validateSync(achievibitConfig);

    if (validationErrors.length > 0) {
      throw new ConfigValidationError(validationErrors);
    }
    return classToPlain(achievibitConfig);
  }
}

function transformToLowerCase(obj: { key: string; value: string }) {
  const camelCasedKey = camelCase(obj.key);

  obj.key = camelCasedKey;

  return camelCasedKey && obj;
}
