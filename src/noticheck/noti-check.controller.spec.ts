import { Test, TestingModule } from '@nestjs/testing';
import { NotiCheckController } from './noti-check.controller';

describe('NotiCheckController', () => {
  let controller: NotiCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotiCheckController],
    }).compile();

    controller = module.get<NotiCheckController>(NotiCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
