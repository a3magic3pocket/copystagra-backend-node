import { Controller, Get, Req, Res, Session, UseGuards } from "@nestjs/common";
import { LoginGuard } from "./login.guard";
import { Session as esSession } from "express-session";
import { IAuthSession } from "./interface/auth-session.interface";
import { Response } from "express";

@Controller()
export class LoginController {
  @Get("/v1/auth/success")
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
