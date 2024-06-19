import { Controller, Get, Req, Res, Session, UseGuards } from "@nestjs/common";
import { LoginGuard } from "./login.guard";
import { Session as esSession } from "express-session";
import { IAuthSession } from "./interface/auth-session.interface";
import { Response } from "express";

@Controller("/v1/auth")
export class LoginController {
  @Get("success")
  @UseGuards(LoginGuard)
  async loginSuccess(@Session() session: IAuthSession, @Res() res: Response) {
    console.log("session", session.cookie.expires);
    res.cookie(process.env.AUTH_HINT_COOKIE_NAME, "none", {
      domain: process.env.AUTH_HINT_COOKIE_DOMAIN,
      expires: session.cookie.expires,
      path: "/",
    });

    return res.send("<div>hello</div>");
  }

  @Get("logout")
  @UseGuards(LoginGuard)
  async logout(@Session() session: esSession, @Res() res: Response) {
    session.destroy(() => {
      console.log("destoryed session");

      res.cookie(process.env.AUTH_HINT_COOKIE_NAME, "none", {
        domain: process.env.AUTH_HINT_COOKIE_DOMAIN,
        maxAge: 0,
        path: "/",
      });

      return res.send("<div>logout</div>");
    });
  }
}
