import { Injectable } from '@nestjs/common';
import findRoot from 'find-root';
import { pathExistsSync, readJSONSync } from 'fs-extra';
import { join } from 'path';

@Injectable()
export class AppService {
  appRoot = findRoot(__dirname, (dir) => {
    const packagePath = join(dir, 'package.json');
    const isPackageJsonExists = pathExistsSync(packagePath);

    if (isPackageJsonExists) {
      const packageContent = readJSONSync(packagePath, { encoding: 'utf8' });
      if (['server', 'client'].indexOf(packageContent.name) < 0) {
        return true;
      }
    }

    return false;
  })

  getHello(): string {
    return 'Hello World!';
  }
}
