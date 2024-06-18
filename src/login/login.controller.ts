import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { GoogleOAuthGuard } from "src/oauth/oauth-google.guard";

@Controller("login")
export class LoginController {
  @Get("oauth2/code/google")
  @UseGuards(GoogleOAuthGuard)
  async loginGoogleRedirect(@Req() req: Request) {
    return "login success";
  }
}
