import { Injectable, Logger } from '@nestjs/common';
import { BadgeFactory } from 'gh-badges';
import { keys } from 'lodash';
import requireAll from 'require-all';

import { AppService } from '../../app.service';

@Injectable()
export class ShieldsService {
  private logger: Logger = new Logger('ShieldsService');
  private bf: BadgeFactory;

  achievements: any;

  constructor(private readonly appService: AppService) {
    this.achievements = requireAll({
      dirname: appService.appRoot + '/achievements',
      filter: /(.+achievement)\.js$/,
      excludeDirs: /^\.(git|svn)$/,
      recursive: true
    });

    this.logger.log('These achievements were registered:');
    this.logger.log(this.achievements);

    this.bf = new BadgeFactory();
  }

  async createAchievementsShield(): Promise<string> {
    const format = {
      format: 'svg',
      text: [ 'achievements', keys(this.achievements).length ],
      labelColor: '#894597',
      color: '#5d5d5d',
      template: 'for-the-badge',
      logo: [
        'data:image/png;base64,iVBORw0KGgoAAAA',
        'NSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJL',
        'R0QA/wD/AP+gvaeTAAAA/0lEQVRYhe3WMU7DM',
        'BjFcadqh0qdWWBl7QU4Ss/AjsREF8RdOhYO0E',
        'qoN2DhFIgBOvBjIIMVxSFyUiEhP8lD7C/v/T9',
        '7sEMoKkoIe+Npn8qpOgCM2VBVVa1ZkzFDcjQd',
        'apDqLIR+u/jnO1AACkABKABdAO9DjHEWfb7lA',
        'LwOAQghXPXx6gJ4zE3GJIRwE0095Zhc4PO3iz',
        '7x7zoq+cB5bifr9tg0AK7xFZXcZYXXZjNs+wB',
        'giofG8hazbIDaeI5dFwAu8dxY2mE+KDyCWGCT',
        'YLj3c86xNliMEh5BVLjFseNEjnVN8pU0BsgSh',
        '5bwA5YnC25AVFjhpR6rk3Zd9K/1Dcae2pUn6m',
        'qiAAAAAElFTkSuQmCC'
      ].join('')
    };

    return this.bf.create(format);
  }
}
