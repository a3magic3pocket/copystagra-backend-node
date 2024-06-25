import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Session,
  UseGuards,
} from "@nestjs/common";
import { CommonListQueryDto } from "@src/global/dto/common-list-query.dto";
import { IAuthSession } from "@src/login/interface/auth-session.interface";
import { LoginGuard } from "@src/login/login.guard";
import { NotiService } from "./noti.service";
import { INotisRespDto } from "./interface/notis-resp-dto.interface";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("noti")
@Controller()
export class NotiController {
  constructor(private notiService: NotiService) {}

  @Get("/v1/my-notifications")
  @ApiOperation({ summary: "내 알림 조회" })
  @ApiQuery({
    name: "page-num",
    type: "integer",
    description: "페이지 번호",
    required: false,
  })
  @ApiQuery({
    name: "page-size",
    type: "integer",
    description: "페이지 사이즈",
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
  @UseGuards(LoginGuard)
  async listMyNotis(
    @Session() session: IAuthSession,
    @Query() query: CommonListQueryDto
  ) {
    let pageNum = query.pageNum ? query.pageNum : 1;
    let pageSize = 9;

    const notis = await this.notiService.getLatestNotis(
      pageNum,
      pageSize,
      session.user.sub
    );

    const notisRespDto: INotisRespDto = {
      pageNum: pageNum,
      pageSize: notis.length,
      notifications: notis,
    };

    return notisRespDto;
  }

  @Get("/v1/my-notifications/unchecked")
  @ApiOperation({ summary: "확인하지 않은 내 알림 조회" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
  @UseGuards(LoginGuard)
  async listMyUncheckedPosts(@Session() session: IAuthSession) {
    let pageNum = 1;
    let pageSize = 9;

    const notis = await this.notiService.getMyUncheckedNotis(
      pageNum,
      pageSize,
      session.user.sub
    );

    return notis;
  }
}
