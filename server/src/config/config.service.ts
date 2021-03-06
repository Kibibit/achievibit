import { join } from 'path';

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
import SmeeClient from 'smee-client';

import { WinstonLogger } from '@kibibit/nestjs-winston';

import { ConfigValidationError } from '@kb-errors';
import { ApiInfo } from '@kb-models';

import { AchievibitConfig } from './achievibit-config.model';
import { initializeWinston } from './winston.config';

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

initializeWinston(appRoot);

const defaultConfigFilePath = join(appRoot, 'defaults.env.json');
const configFilePath = join(appRoot, `${ environment }.env.json`);

const packageDetails = new ApiInfo(readJSONSync(join(appRoot, 'package.json')));

const eventLogger: WinstonLogger = new WinstonLogger('SmeeEvents');

interface IEvents {
  close(): void;
}

nconf
  .argv({
    parseValues: true
  })
  .env({
    lowerCase: true,
    parseValues: true,
    transform: transformToLowerCase
  })
  .file('defaults', { file: defaultConfigFilePath })
  .file('environment', { file: configFilePath });

let smee: SmeeClient;
let events: IEvents;
let configService: ConfigService;

/**
 * This is a **Forced Singleton**.
 * This means that even if you try to create
 * another ConfigService, you'll always get the
 * first one.
 */
@Exclude()
export class ConfigService extends AchievibitConfig {
  private logger: WinstonLogger = new WinstonLogger('ConfigService');

  private readonly mode: string = environment;

  get smee(): SmeeClient {
    return smee;
  }

  get events(): IEvents {
    return events;
  }

  get packageDetails(): ApiInfo {
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

    // attach configuration to this service
    Object.assign(this, envConfig);

    this.initializeSmee(passedConfig);

    if (config.saveToFile) {
      writeJson(configFilePath, classToPlain(this), { spaces: 2 });
    }

    const schema = this.toJsonSchema();
    writeJSONSync(join(this.appRoot, 'env.schema.json'), schema);

    configService = this;
  }

  initializeSmee(passedConfig?: Partial<AchievibitConfig>) {
    const smeeEnvironments = [
      'development',
      'devcontainer'
    ];
    const passedConfigNodeEnv = get(passedConfig, 'nodeEnv', '');

    if (smeeEnvironments.includes(this.nodeEnv) ||
      smeeEnvironments.includes(passedConfigNodeEnv)) {
      if (!smee) {
        smee = new SmeeClient({
          source: this.webhookProxyUrl,
          target:
            `http://localhost:${ this.port }/${ this.webhookDestinationUrl }`,
          logger: this.getSmeeLogger()
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
    envConfig: Record<string, unknown>
  ): Partial<AchievibitConfig> {
    const achievibitConfig = new AchievibitConfig(envConfig);
    const validationErrors = validateSync(achievibitConfig);

    if (validationErrors.length > 0) {
      throw new ConfigValidationError(validationErrors);
    }
    return classToPlain(achievibitConfig);
  }

  private getSmeeLogger() {
    return {
      error(...data: any[]) {
        const message = data.shift();
        console.log(data);
        const metadata = data.length ? { data } : undefined;
        eventLogger.error(message, metadata);
      },
      info(...data: any[]) {
        const message = data.shift();
        const metadata = data.length ? { data } : undefined;
        eventLogger.info(message, metadata);
      }
    };
  }
}

function transformToLowerCase(obj: { key: string; value: string }) {
  const camelCasedKey = camelCase(obj.key);

  obj.key = camelCasedKey;

  return camelCasedKey && obj;
}
