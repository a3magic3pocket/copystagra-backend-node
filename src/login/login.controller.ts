import { Controller, Get, Req, Session, UseGuards } from "@nestjs/common";
import { LoginGuard } from "./login.guard";
import { Session as esSession } from "express-session";
import { IAuthSession } from "./interface/auth-session.interface";

@Controller("/v1/auth")
export class LoginController {
  @Get("success")
  @UseGuards(LoginGuard)
  async loginSuccess(@Req() req: Request, @Session() session: IAuthSession) {
    return "hello";
  }

  @Get("logout")
  @UseGuards(LoginGuard)
  async logout(@Session() session: esSession) {
    session.destroy(() => {
      console.log("destoryed session");
    });
    return "logout";
  }
}
