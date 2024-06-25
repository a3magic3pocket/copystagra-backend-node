import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Session,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";
import { IAuthSession } from "@src/login/interface/auth-session.interface";
import { LoginGuard } from "@src/login/login.guard";
import { UserRepository } from "./user.repository";
import { IUserRespDto } from "./interface/user-resp-dto.interface";
import { IErrorRespDto } from "@src/global/dto/interface/error-resp-dto.interface";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("user")
@Controller()
export class UserController {
  constructor(private userRepository: UserRepository) {}

  @Get("/v1/my-user-info")
  @ApiOperation({ summary: "내 정보 조회" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
  @UseGuards(LoginGuard)
  async retrieveMyUser(@Session() session: IAuthSession) {
    const errorRespDto: IErrorRespDto = {
      code: "9999",
      locale: "ko",
      message: "없는 유저 입니다",
    };

    const user = await this.userRepository.findById(session.user.sub);
    if (!user) {
      throw new UnprocessableEntityException(errorRespDto);
    }

    const userRespDto: IUserRespDto = {
      email: user.email,
      name: user.name,
      locale: user.locale,
      description: user.description,
      userImagePath: user.userImagePath,
    };

    return userRespDto;
  }

  @Get("/v1/my-user-info/:name")
  @ApiOperation({ summary: "유저 정보 조회" })
  @ApiParam({ name: "name", type: "string", description: "유저 명" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "조회 성공",
  })
  @UseGuards(LoginGuard)
  async retrieve(@Param() params: Record<string, string>) {
    const errorRespDto: IErrorRespDto = {
      code: "9999",
      locale: "ko",
      message: "없는 유저 입니다",
    };

    if (!Object.keys(params).includes("name")) {
      throw new UnprocessableEntityException(errorRespDto);
    }

    const user = await this.userRepository.findByName(params.name);
    if (!user) {
      throw new UnprocessableEntityException(errorRespDto);
    }

    const userRespDto: IUserRespDto = {
      email: user.email,
      name: user.name,
      locale: user.locale,
      description: user.description,
      userImagePath: user.userImagePath,
    };

    return userRespDto;
  }
}
