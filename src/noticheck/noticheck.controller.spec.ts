import { Test, TestingModule } from '@nestjs/testing';
import { NoticheckController } from './noticheck.controller';

describe('NoticheckController', () => {
  let controller: NoticheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticheckController],
    }).compile();

    controller = module.get<NoticheckController>(NoticheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
