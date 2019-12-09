import { Injectable } from '@nestjs/common';
import findRoot from 'find-root';
import { readJSON } from 'fs-extra';
import { join } from 'path';

import { PackageDetailsDto } from './models/package-details.model';

@Injectable()
export class AppService {
  private packagePromise: Promise<PackageDetailsDto>;

  async getPackageDetails(): Promise<PackageDetailsDto> {
    if (this.packagePromise) { return this.packagePromise; }

    this.packagePromise = this.getPackageDetailsPromise();

    return this.packagePromise;
  }

  private async getPackageDetailsPromise(): Promise<PackageDetailsDto> {
    const root = findRoot(__dirname);

    const packageInfo = await readJSON(join(root, 'package.json'));

    return new PackageDetailsDto(packageInfo);
  }
}
