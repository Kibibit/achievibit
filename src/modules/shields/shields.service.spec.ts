import { Test, TestingModule } from '@nestjs/testing';
import { JSDOM } from 'jsdom';
import { keys, noop } from 'lodash';
import requireAll from 'require-all';

import { AppService } from '@kb-app';
import { ConfigModule } from '@kb-config';
import { DtoMockGenerator } from '@kb-dev-tools';

import { ShieldsService } from './shields.service';

jest.mock('require-all');

const mocked = requireAll as jest.Mocked<typeof requireAll>;

const mockedAchievements = DtoMockGenerator.achievementScripts();

mocked.mockReturnValue(mockedAchievements);

describe('ShieldsService', () => {
  let service: ShieldsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ ConfigModule ],
      providers: [
        { provide: AppService, useValue: { getPackageDetails: noop } },
        ShieldsService
      ]
    }).compile();

    service = module.get<ShieldsService>(ShieldsService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should create an all achievements shield with number of defined achievements', async () => {
    const twoAchievements = DtoMockGenerator.achievementScripts(2);
    service.achievements = twoAchievements;
    const svgAchievementsShield = await service.createAchievementsShield();

    const dom = new JSDOM(svgAchievementsShield);

    const allSvgTextElements: SVGTextElement[] = Array.from(dom.window.document.querySelectorAll('text'));
    const allSvgTextContent: string[] = allSvgTextElements.map((svg) => svg.textContent);

    const numberOfAchievements = keys(twoAchievements).length.toString();

    expect(allSvgTextContent).toContain(numberOfAchievements);
    // compare the svg output for changes
    expect(svgAchievementsShield).toMatchSnapshot();
  });
});
