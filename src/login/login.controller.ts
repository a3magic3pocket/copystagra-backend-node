import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  Session,
  UseGuards,
} from "@nestjs/common";
import { LoginGuard } from "./login.guard";
import { Session as esSession } from "express-session";
import { IAuthSession } from "./interface/auth-session.interface";
import { Response } from "express";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('login')
@Controller()
export class LoginController {
  @Get("/v1/auth/success")
  @ApiOperation({
    summary: "로그인 성공 시, 프론트엔드 홈으로 리다이렉트 시킵니다.",
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: "프론트엔드 홈으로 리다이렉트",
  })
  @UseGuards(LoginGuard)
  async loginSuccess(@Session() session: IAuthSession, @Res() res: Response) {
    res.cookie(process.env.AUTH_HINT_COOKIE_NAME, "none", {
      domain: process.env.AUTH_HINT_COOKIE_DOMAIN,
      expires: session.cookie.expires,
      path: "/",
    });

    return res.redirect(process.env.FROUNTEND_URI);
  }

  @Get("/v1/auth/logout")
  @ApiOperation({
    summary: "로그아웃 처리 후 프론트엔드 홈으로 리다이렉트 시킵니다.",
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: "프론트엔드 홈으로 리다이렉트",
  })
  @UseGuards(LoginGuard)
  async logout(@Session() session: esSession, @Res() res: Response) {
    session.destroy(() => {
      res.cookie(process.env.AUTH_HINT_COOKIE_NAME, "none", {
        domain: process.env.AUTH_HINT_COOKIE_DOMAIN,
        maxAge: 0,
        path: "/",
      });

      return res.redirect(process.env.FROUNTEND_URI);
    });
  }
}
