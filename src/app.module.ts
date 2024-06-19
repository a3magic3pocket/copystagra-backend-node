import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LikeController } from "./like/like.controller";
import { NotiController } from "./noti/noti.controller";
import { NoticheckController } from "./noticheck/noticheck.controller";
import { PostController } from "./post/post.controller";
import { OAuthModule } from "./oauth/oauth.module";
import { GoogleStrategy } from "./oauth/oauth-google.strategy";
import { ConfigModule } from "@nestjs/config";
import { LoginController } from "./login/login.controller";
import { UserModule } from "./user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { PostModule } from "./post/post.module";

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
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
