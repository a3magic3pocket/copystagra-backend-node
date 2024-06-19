import { Controller, Post, Session } from "@nestjs/common";
import { NotiCheckRepository } from "./noti-check.repository";
import { IAuthSession } from "src/login/interface/auth-session.interface";
import { getKorTime } from "src/global/time/time-util";
import { ISimpleSuccessRespDto } from "src/global/dto/interface/simple-success-resp-dto.interface";

@Controller()
export class NotiCheckController {
  constructor(private notiCheckRepository: NotiCheckRepository) {}

  @Post("/v1/noti-check")
  async create(@Session() session: IAuthSession) {
    const ownerId = session.user.sub;
    const checkedTime = getKorTime(new Date()).toISOString();

    await this.notiCheckRepository.upsert(ownerId, checkedTime);

    const result: ISimpleSuccessRespDto = {
      message: "success",
    };

    return result;
  }
}
