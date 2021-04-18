import { MockModel } from '@kb-dev-tools';

describe('Base Model', () => {
  let model: MockModel;

  beforeEach(() => model = new MockModel({
    mockAttribute: 'nice',
    mockPrivateAttribute: 'bad'
  }));
  
  it ('should allow extending', () => {
    expect(model).toBeDefined();
  });

  it('should obfuscate and convert to plain object', () => {
    const asJson = model.toJSON();

    expect(model.mockAttribute).toBe('nice');
    expect(model.mockPrivateAttribute).toBe('bad');
    expect(asJson).toBeDefined();
    expect(asJson.mockPrivateAttribute).toBeUndefined();
    expect(asJson.mockAttribute).toBe('nice');
  });

  it('should obfuscate and convert to string', () => {
    const asString = model.toString();
    expect(asString).toMatchSnapshot();
    expect(asString).not.toMatch(/mockPrivateAttribute/g);
  });
});
