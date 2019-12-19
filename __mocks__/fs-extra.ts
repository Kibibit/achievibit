import { ReadOptions, WriteOptions } from 'fs-extra';

export function writeJson(file: string, object: any, options?: WriteOptions): Promise<void> {
  return Promise.resolve();
}

export function readJSONSync(file: string, options?: ReadOptions): any {
  return file.endsWith('package.json') ? {
    name: 'achievibit',
    version: '0.0.1',
    author: '',
    license: 'MIT',
    description: ''
  } : {};
}
