import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { GoogleOAuthGuard } from "./oauth-google.guard";

@Controller("oauth2")
export class OAuthController {
  @Get("authorization/google")
  @UseGuards(GoogleOAuthGuard)
  async loginGoogle(@Req() req: Request) {}

  @Get("login/oauth2/code/google")
  @UseGuards(GoogleOAuthGuard)
  async loginGoogleRedirect(@Req() req: Request) {}
}
