import { Module } from "@nestjs/common";
import { OAuthController } from "./oauth.controller";
import { LoginController } from "@src/login/login.controller";

@Module({
  controllers: [OAuthController, LoginController],
})
export class OAuthModule {}
