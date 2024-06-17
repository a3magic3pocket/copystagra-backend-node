import { Test, TestingModule } from '@nestjs/testing';
import { MetapostlistController } from './metapostlist.controller';

describe('MetapostlistController', () => {
  let controller: MetapostlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetapostlistController],
    }).compile();

    controller = module.get<MetapostlistController>(MetapostlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
