import { chain, times } from 'lodash';

import { DtoMockGenerator } from '@kb-dev-tools';
import { ConfigValidationError } from '@kb-errors';

import {
  AchievibitConfig,
  NODE_ENVIRONMENT_OPTIONS,
  SMEE_IO_REGEX
} from './achievibit-config.model';
import { ConfigService } from './config.service';

// not a jest component so testing it as a node module
describe('ConfigService', () => {

  describe('Forced Singleton and baypass', () => {
    let configService: ConfigService;
    beforeEach(() => {
      configService = new ConfigService({
        webhookProxyUrl: 'https://smee.io/achievibit-test'
      });
    });

    afterEach(() => {
      configService.closeEvents();
    });

    it('should be defined', () => {
      expect(configService).toBeDefined();
    });

    it('should return the same instance if initiated without an input',
    () => {
      expect(new ConfigService()).toBe(configService);
    });

    it('should create a new instance when passed an override', () => {
      expect(new ConfigService({} as AchievibitConfig)).not.toBe(configService);
    });

    it('should set default values to everything that needs one',
    () => {
      expect(configService.toPlainObject()).toMatchSnapshot();
    });
  });

  describe('Smee & Events', () => {
    it('should NOT initial smee and events on production', () => {
      const productionService = new ConfigService({
        nodeEnv: 'production'
      });

      expect(productionService.smee).toBeUndefined();
      expect(productionService.events).toBeUndefined();

      productionService.closeEvents();
    });

    it('should initial smee and events on development', () => {
      const productionService = new ConfigService({
        nodeEnv: 'development'
      });

      expect(productionService.smee).toBeDefined();
      expect(productionService.events).toBeDefined();

      productionService.closeEvents();
    });
  });

  describe('Saving configuration', () => {
    it.todo('should allow user to save configuration to file');
  });

  describe('Validations', () => {
    describe('nodeEnv', () => {

      chain(NODE_ENVIRONMENT_OPTIONS)
        .forEach((nodeEnv: string) => {
          it(`should ACCEPT ${ nodeEnv }`, () => {
            const serviceWrapper = () => new ConfigService({ nodeEnv });

            expect(serviceWrapper().toPlainObject).toBeDefined();

            serviceWrapper().closeEvents();
          });
        })
        .value();

      it('should REJECT other values', () => {

        const nodeEnv = 'value_not_allowed';

        const wrongEnv = () => new ConfigService({ nodeEnv });

        const nodeEnvNumber = 4;

        const wrongEnvType =
          () => new (ConfigService as any)({ nodeEnv: nodeEnvNumber });

        expect(wrongEnv).toThrowError(ConfigValidationError);
        expect(wrongEnv).toThrowErrorMatchingSnapshot();

        expect(wrongEnvType).toThrowError(ConfigValidationError);
        expect(wrongEnvType).toThrowErrorMatchingSnapshot();
      });

    });

    describe('port', () => {
      it('should ACCEPT numbers', () => {
        const port = DtoMockGenerator.integer();
        const service = new ConfigService({ port });

        expect(service.port).toBe(port);
      });

      it('should REJECT values other than numbers', () => {
        const stringPort = () => new (ConfigService as any)({ port: 'hello' });
        const ObjectPort = () => new (ConfigService as any)({ port: {} });

        expect(stringPort).toThrowError(ConfigValidationError);
        expect(stringPort).toThrowErrorMatchingSnapshot();

        expect(ObjectPort).toThrowError(ConfigValidationError);
        expect(ObjectPort).toThrowErrorMatchingSnapshot();
      });

    });

    describe('dbUrl', () => {
      it('should ACCEPT empty value', () => {
        const service = new ConfigService({ dbUrl: undefined });

        expect(service.dbUrl).toBeUndefined();

        service.closeEvents();
      });

      it('should ACCEPT localhost mongodb URL', () => {
        const localMongodbUrl = 'mongodb://localhost:27017';

        const configService = new ConfigService({ dbUrl: localMongodbUrl });

        expect(configService.dbUrl).toBe(localMongodbUrl);
      });

      it('should ACCEPT valid mongodb URLS', () => {
        const mongodbProtocolUrls =
          times(10, () => DtoMockGenerator.mongodbUrl());

        chain(mongodbProtocolUrls)
          .keyBy()
          .mapValues((mongodbUrl) => new ConfigService({ dbUrl: mongodbUrl }))
          .forEach((configService, mongodbUrl) => {
            expect(configService.dbUrl).toBe(mongodbUrl);
          })
          .value();
      });

      it('should REJECT non-mongodb URLS', () => {
        const invalidUrl =
          () => new ConfigService({ dbUrl: 'https://google.com/' });

        expect(invalidUrl).toThrowError(ConfigValidationError);
        expect(invalidUrl).toThrowErrorMatchingSnapshot();
      });
    });

    describe('webhookProxyUrl', () => {
      it('should ACCEPT smee.io URLS', () => {
        const smeeProtocolUrls =
          times(10, () => DtoMockGenerator.randexp(SMEE_IO_REGEX).gen());

        chain(smeeProtocolUrls)
          .keyBy()
          .mapValues((smeeProtocolUrl) => new ConfigService({
            webhookProxyUrl: smeeProtocolUrl
          }))
          .forEach((configService, smeeProtocolUrl) => {
            configService.closeEvents();
            expect(configService.webhookProxyUrl).toBe(smeeProtocolUrl);
          })
          .value();
      });

      it('should REJECT non-smee URLS', () => {
        const invalidUrl =
          () => new ConfigService({ webhookProxyUrl: 'https://google.com/' });

        expect(invalidUrl).toThrowError(ConfigValidationError);
        expect(invalidUrl).toThrowErrorMatchingSnapshot();
      });

      it('should REJECT non-URLS', () => {
        const invalidUrl =
          () => new ConfigService({ webhookProxyUrl: 'hello world' });

        expect(invalidUrl).toThrowError(ConfigValidationError);
        expect(invalidUrl).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
