import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  Session,
  UseGuards,
} from "@nestjs/common";
import { GoogleOAuthGuard } from "./oauth-google.guard";
import { IAuthUserRequest } from "src/login/interface/auth-user-request-interface";
import { IAuthSession } from "src/login/interface/auth-session.interface";
import { Response } from "express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("oauth")
@Controller()
export class OAuthController {
  @Get("/oauth2/authorization/google")
  @ApiOperation({ summary: "구글 로그인 페이지로 리다이렉트 시킵니다." })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: "구글 로그인 페이지로 리다이렉트",
  })
  @UseGuards(GoogleOAuthGuard)
  async loginGoogle(@Req() req: Request) {}

  @Get("/login/oauth2/code/google")
  @ApiOperation({
    summary: "구글 로그인 성공 시, 유저 정보와 data를 session에 담습니다.",
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: "로그인 성공 페이지로 리다이렉트",
  })
  @UseGuards(GoogleOAuthGuard)
  async loginGoogleRedirect(
    @Req() req: IAuthUserRequest,
    @Session() session: IAuthSession,
    @Res() res: Response
  ) {
    session.user = req.user;
    session.data = {};

    res.redirect("/v1/auth/success");
    return;
  }
}
