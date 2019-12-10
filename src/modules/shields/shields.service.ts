import { Injectable } from '@nestjs/common';
import { keys } from 'lodash';
import requireAll from 'require-all';
import { AppService } from '../../app.service';


// console.log(badge.BadgeFactory);

@Injectable()
export class ShieldsService {
  private achievements: any;

  constructor(private readonly appService: AppService) {
    this.achievements = requireAll({
      dirname: appService.appRoot + '/achievements',
      filter: /(.+achievement)\.js$/,
      excludeDirs: /^\.(git|svn)$/,
      recursive: true
    });
  }

  async createAchievementsShield(): Promise<number> {
    return new Promise((resolve) => {
      resolve(keys(this.achievements).length);
    });
  }
}
