import { Controller, HttpStatus, Post, Session } from "@nestjs/common";
import { NotiCheckRepository } from "./noti-check.repository";
import { IAuthSession } from "@src/login/interface/auth-session.interface";
import { getKorTime } from "@src/global/time/time-util";
import { ISimpleSuccessRespDto } from "@src/global/dto/interface/simple-success-resp-dto.interface";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("notiCheck")
@Controller()
export class NotiCheckController {
  constructor(private notiCheckRepository: NotiCheckRepository) {}

  @Post("/v1/noti-check")
  @ApiOperation({ summary: "알림 확인 시간 갱신" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "갱신 성공",
  })
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
