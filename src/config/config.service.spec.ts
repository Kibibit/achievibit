import { chain, times } from 'lodash';

import { DtoMockGenerator } from '@kb-dev-tools';
import { ConfigValidationError } from '@kb-errors';

import { AchievibitConfig, NODE_ENVIRONMENT_OPTIONS, SMEE_IO_REGEX } from './achievibit-config.model';
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

    afterEach(async (done) => {
      configService.closeEvents();

      done();
    });

    it('should be defined', async (done) => {
      expect(configService).toBeDefined();

      done();
    });

    it('should return the same instance if initiated without an input', async (done) => {
      expect(new ConfigService()).toBe(configService);

      done();
    });

    it('should create a new instance when passed an override', async (done) => {
      expect(new ConfigService({} as AchievibitConfig)).not.toBe(configService);

      done();
    });

    it('should set default values to everything that needs one', async (done) => {
      expect(configService.toPlainObject()).toMatchSnapshot();

      done();
    });
  });

  describe('Smee & Events', () => {
    it('should NOT initial smee and events on production', async (done) => {
      const productionService = new ConfigService({
        nodeEnv: 'production'
      });

      expect(productionService.smee).toBeUndefined();
      expect(productionService.events).toBeUndefined();

      productionService.closeEvents();

      done();
    });

    it('should initial smee and events on development', async (done) => {
      const productionService = new ConfigService({
        nodeEnv: 'development'
      });

      expect(productionService.smee).toBeDefined();
      expect(productionService.events).toBeDefined();

      productionService.closeEvents();

      done();
    });
  });

  describe('Saving configuration', () => {
    it.todo('should allow user to save configuration to file');
  });

  describe('Validations', () => {
    describe('nodeEnv', () => {

      chain(NODE_ENVIRONMENT_OPTIONS)
        .forEach((nodeEnv: string) => {
          it(`should ACCEPT ${ nodeEnv }`, async (done) => {
            const serviceWrapper = () => new ConfigService({ nodeEnv });

            expect(serviceWrapper().toPlainObject).toBeDefined();

            serviceWrapper().closeEvents();

            done();
          });
        })
        .value();

      it('should REJECT other values', async (done) => {

        const nodeEnv = 'value_not_allowed';

        const wrongEnv = () => new ConfigService({ nodeEnv });

        const nodeEnvNumber = 4;

        const wrongEnvType = () => new (ConfigService as any)({ nodeEnv: nodeEnvNumber });

        expect(wrongEnv).toThrowError(ConfigValidationError);
        expect(wrongEnv).toThrowErrorMatchingSnapshot();

        expect(wrongEnvType).toThrowError(ConfigValidationError);
        expect(wrongEnvType).toThrowErrorMatchingSnapshot();

        done();
      });

    });

    describe('port', () => {
      it('should ACCEPT numbers', async (done) => {
        const port = DtoMockGenerator.integer();
        const service = new ConfigService({ port });

        expect(service.port).toBe(port);

        done();
      });

      it('should REJECT values other than numbers', async (done) => {
        const stringPort = () => new (ConfigService as any)({ port: 'hello' });
        const ObjectPort = () => new (ConfigService as any)({ port: {} });

        expect(stringPort).toThrowError(ConfigValidationError);
        expect(stringPort).toThrowErrorMatchingSnapshot();

        expect(ObjectPort).toThrowError(ConfigValidationError);
        expect(ObjectPort).toThrowErrorMatchingSnapshot();

        done();
      });

    });

    describe('dbUrl', () => {
      it('should ACCEPT empty value', async (done) => {
        const service = new ConfigService({ dbUrl: undefined });

        expect(service.dbUrl).toBeUndefined();

        service.closeEvents();

        done();
      });

      it('should ACCEPT localhost mongodb URL', async (done) => {
        const localMongodbUrl = 'mongodb://localhost:27017';

        const configService = new ConfigService({ dbUrl: localMongodbUrl });

        expect(configService.dbUrl).toBe(localMongodbUrl);

        done();
      });

      it('should ACCEPT valid mongodb URLS', async (done) => {
        const mongodbProtocolUrls = times(10, () => DtoMockGenerator.mongodbUrl());

        chain(mongodbProtocolUrls)
          .keyBy()
          .mapValues((mongodbUrl) => new ConfigService({ dbUrl: mongodbUrl }))
          .forEach((configService, mongodbUrl) => {
            expect(configService.dbUrl).toBe(mongodbUrl);
          })
          .value();

        done();
      });

      it('should REJECT non-mongodb URLS', async (done) => {
        const invalidUrl = () => new ConfigService({ dbUrl: 'https://google.com/' });

        expect(invalidUrl).toThrowError(ConfigValidationError);
        expect(invalidUrl).toThrowErrorMatchingSnapshot();

        done();
      });
    });

    describe('webhookProxyUrl', () => {
      it('should ACCEPT smee.io URLS', async (done) => {
        const smeeProtocolUrls = times(10, () => DtoMockGenerator.randexp(SMEE_IO_REGEX).gen());

        console.log(smeeProtocolUrls);

        chain(smeeProtocolUrls)
          .keyBy()
          .mapValues((smeeProtocolUrl) => new ConfigService({ webhookProxyUrl: smeeProtocolUrl }))
          .forEach((configService, smeeProtocolUrl) => {
            configService.closeEvents();
            expect(configService.webhookProxyUrl).toBe(smeeProtocolUrl);
          })
          .value();

        done();
      });

      it('should REJECT non-smee URLS', async (done) => {
        const invalidUrl = () => new ConfigService({ webhookProxyUrl: 'https://google.com/' });

        expect(invalidUrl).toThrowError(ConfigValidationError);
        expect(invalidUrl).toThrowErrorMatchingSnapshot();

        done();
      });

      it('should REJECT non-URLS', async (done) => {
        const invalidUrl = () => new ConfigService({ webhookProxyUrl: 'hello world' });

        expect(invalidUrl).toThrowError(ConfigValidationError);
        expect(invalidUrl).toThrowErrorMatchingSnapshot();

        done();
      });
    });
  });
});
