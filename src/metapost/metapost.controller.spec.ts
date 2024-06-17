import { Test, TestingModule } from '@nestjs/testing';
import { MetapostController } from './metapost.controller';

describe('MetapostController', () => {
  let controller: MetapostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetapostController],
    }).compile();

    controller = module.get<MetapostController>(MetapostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
