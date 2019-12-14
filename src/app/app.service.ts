import { Injectable } from '@nestjs/common';

import { ConfigService } from '@kb-config';
import { PackageDetailsDto } from '@kb-models';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }
  getPackageDetails(): PackageDetailsDto {

    return this.configService.packageDetails;
  }
}
