import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OAuthModule } from "./oauth/oauth.module";
import { GoogleStrategy } from "./oauth/oauth-google.strategy";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostModule } from "./post/post.module";
import { NotiModule } from "./noti/noti.module";
import { NotiCheckModule } from "./noticheck/noti-check.module";
import { LikeModule } from "./like/like.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env.development",
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: `${process.env.MONGODB_DATABASE_NAME}`,
    }),
    OAuthModule,
    UserModule,
    PostModule,
    NotiModule,
    NotiCheckModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
