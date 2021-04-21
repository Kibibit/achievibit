import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import {
  closeInMemoryDatabaseConnection,
  createInMemoryDatabaseModule,
  MockModel,
  MockService
} from '@kb-dev-tools';

describe('BaseService', () => {
  let service: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        createInMemoryDatabaseModule(),
        MongooseModule.forFeature([{
          name: MockModel.modelName,
          schema: MockModel.schema
        }])
      ],
      providers: [MockService]
    }).compile();

    service = module.get<MockService>(MockService);
  }, 10000);

  afterEach(async () => {
    await closeInMemoryDatabaseConnection();
  });
 
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow creating new model instance', () => {
    const data = {
      mockAttribute: 'nice',
      mockPrivateAttribute: 'bad'
    };
    const newModelInstance = service.createModel(data);

    expect(newModelInstance).toBeDefined();
  });

  describe('create', () => {
    it('should allow creating model', async () => {
      const data = new MockModel({
        mockAttribute: 'nice',
        mockPrivateAttribute: 'bad'
      });
      const newModelInstance = await service.create(data);
  
      expect(newModelInstance).toBeDefined();
    });
  
    it('should fail creating model with missing required attribute',
      async () => {
        const data = new MockModel({
          mockPrivateAttribute: 'bad'
        });
        expect(service.create(data)).rejects.toThrowErrorMatchingSnapshot();
      }
    );
  });

  describe('delete item', () => {
    it('should allow deleting an existing item', async () => {
      const data = new MockModel({
        mockAttribute: 'nice',
        mockPrivateAttribute: 'bad'
      });
      const newModelInstance = await service.create(data);
      const foundOne = await service.findOneAsync({
        id: newModelInstance.id
      });
  
      expect(foundOne).toBeDefined();
      expect(foundOne.id).toBeDefined();
      expect(new MockModel(foundOne.toObject()).toJSON())
        .toEqual(data.toJSON());
  
      await service.delete(data).exec();
  
      const missingOne = await service.findOneAsync({
        id: newModelInstance.id
      });
      
      expect(missingOne).toBeNull();
    });

    it('should allow deleting an existing item asynchronously', async () => {
      const data = new MockModel({
        mockAttribute: 'nice',
        mockPrivateAttribute: 'bad'
      });
      const newModelInstance = await service.create(data);
      const foundOne = await service.findOneAsync({
        id: newModelInstance.id
      });
  
      expect(foundOne).toBeDefined();
      expect(foundOne.id).toBeDefined();
      expect(new MockModel(foundOne.toObject()).toJSON())
        .toEqual(data.toJSON());
  
      await service.deleteAsync(data);
  
      const missingOne = await service.findOneAsync({
        id: newModelInstance.id
      });
      
      expect(missingOne).toBeNull();
    });
  
    it('should throw error when deleting a missing item', async () => {
      expect(service.deleteAsync({ _id: '???' }))
        .rejects.toThrowErrorMatchingSnapshot();
    });

    it('should allow deleting an existing item by id', async () => {
      const data = new MockModel({
        mockAttribute: 'nice',
        mockPrivateAttribute: 'bad'
      });
      // EXEC
      let newModelInstance = await service.create(data);
      let foundOne = await service.findOneAsync({
        id: newModelInstance.id
      });
  
      expect(foundOne).toBeDefined();
      expect(foundOne.id).toBeDefined();
      expect(new MockModel(foundOne.toObject()).toJSON())
        .toEqual(data.toJSON());
  
      await service.deleteById(foundOne.id).exec();
  
      let missingOne = await service.findOneAsync({
        id: foundOne.id
      });
      
      expect(missingOne).toBeNull();
      //ASYNC
      newModelInstance = await service.create(data);
      foundOne = await service.findOneAsync({
        id: newModelInstance.id
      });
  
      expect(foundOne).toBeDefined();
      expect(foundOne.id).toBeDefined();
      expect(new MockModel(foundOne.toObject()).toJSON())
        .toEqual(data.toJSON());
  
      await service.deleteByIdAsync(foundOne.id);
  
      missingOne = await service.findOneAsync({
        id: foundOne.id
      });
      
      expect(missingOne).toBeNull();
    });
  });

  describe('find', () => {
    it('should allow to find item by id', async () => {
      const data = new MockModel({
        mockAttribute: 'nice',
        mockPrivateAttribute: 'bad'
      });
      await service.create(data);
      const foundOne = await service.findOneAsync({
        mockAttribute: 'nice'
      });
  
      const itemFoundById = await service.findById(foundOne.id).exec();
      const asyncItemFoundById = await service.findByIdAsync(foundOne.id);
  
      expect(itemFoundById.id).toBe(foundOne.id);
      expect(itemFoundById.mockAttribute).toBe('nice');
      expect(itemFoundById.mockPrivateAttribute).toBe('bad');
      
      expect(asyncItemFoundById.id).toBe(foundOne.id);
      expect(asyncItemFoundById.mockAttribute).toBe('nice');
      expect(asyncItemFoundById.mockPrivateAttribute).toBe('bad');
    });

    it('should allow finding all items', async () => {
      const data1 = new MockModel({
        mockAttribute: '1',
        mockPrivateAttribute: '1'
      });

      const data2 = new MockModel({
        mockAttribute: '2',
        mockPrivateAttribute: '2'
      });

      await service.create(data1);
      await service.create(data2);

      const allItems = await service.findAll().exec();
      const asyncAllItems = await service.findAllAsync();

      const asMockModels = allItems
        .map((item) => new MockModel(item.toObject()));
      const asyncAsMockModels = asyncAllItems
        .map((item) => new MockModel(item.toObject()));

      expect(asMockModels)
        .toEqual(expect.arrayContaining([
          expect.objectContaining(data1),
          expect.objectContaining(data2)
        ]));
        expect(asyncAsMockModels)
        .toEqual(expect.arrayContaining([
          expect.objectContaining(data1),
          expect.objectContaining(data2)
        ]));
    });

    it('should allow finding one item', async () => {
      const data1 = new MockModel({
        mockAttribute: '1',
        mockPrivateAttribute: '1'
      });

      const data2 = new MockModel({
        mockAttribute: '1',
        mockPrivateAttribute: '2'
      });

      await service.create(data1);
      await service.create(data2);

      const filter = {
        mockAttribute: '1'
      };

      const foundItem = await service.findOne(filter).exec();
      const asyncFoundItem = await service.findOneAsync(filter);

      const asMockModel = new MockModel(foundItem.toObject());
      const asyncAsMockModel = new MockModel(asyncFoundItem.toObject());

      expect(asMockModel)
        .toEqual(expect.objectContaining(filter));
        expect(asyncAsMockModel)
        .toEqual(expect.objectContaining(filter));
    });
  });

  describe('Count', () => {
    it('should count items', async () => {
      const data1 = new MockModel({
        mockAttribute: '1',
        mockPrivateAttribute: '1'
      });

      const data2 = new MockModel({
        mockAttribute: '2',
        mockPrivateAttribute: '2'
      });

      let counter = await service.count().exec();
      let asyncCounter = await service.countAsync();
      expect(counter).toBe(0);
      expect(asyncCounter).toBe(0);
      await service.create(data1);
      counter = await service.count().exec();
      asyncCounter = await service.countAsync();
      expect(counter).toBe(1);
      expect(asyncCounter).toBe(1);
      await service.create(data2);
      counter = await service.count().exec();
      asyncCounter = await service.countAsync();
      expect(counter).toBe(2);
      expect(asyncCounter).toBe(2);
    });
  });

  describe('Update', () => {
    it('should update items', async () => {
      const data = new MockModel({
        mockAttribute: '1',
        mockPrivateAttribute: '1'
      });

      await service.create(data);

      const createdItem = await service.findOneAsync({ mockAttribute: '1' });

      expect(createdItem).toBeDefined();
      expect(createdItem.id).toBeDefined();
      expect(new MockModel(createdItem.toObject()).toJSON())
        .toEqual(data.toJSON());
      
      await service.update({
        id: createdItem.id,
        mockAttribute: '50'
      }).exec();

      let changedItem = await service.findByIdAsync(createdItem.id);

      expect(changedItem).toBeDefined();
      expect(changedItem.id).toBe(createdItem.id);
      expect(changedItem.mockAttribute).toBe('50');

      await service.updateAsync({
        id: createdItem.id,
        mockPrivateAttribute: '5'
      });

      changedItem = await service.findByIdAsync(createdItem.id);

      expect(changedItem).toBeDefined();
      expect(changedItem.id).toBe(createdItem.id);
      expect(changedItem.mockAttribute).toBe('50');
      expect(changedItem.mockPrivateAttribute).toBe('5');
    });
  });
});
