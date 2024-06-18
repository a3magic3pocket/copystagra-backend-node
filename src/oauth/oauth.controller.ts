import { Controller, Get, Req, Res, Session, UseGuards } from "@nestjs/common";
import { GoogleOAuthGuard } from "./oauth-google.guard";
import { IAuthUserRequest } from "src/login/interface/auth-user-request-interface";
import { IAuthSession } from "src/login/interface/auth-session.interface";
import { Response } from "express";

@Controller()
export class OAuthController {
  @Get("/oauth2/authorization/google")
  @UseGuards(GoogleOAuthGuard)
  async loginGoogle(@Req() req: Request) {}

  @Get("/login/oauth2/code/google")
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
