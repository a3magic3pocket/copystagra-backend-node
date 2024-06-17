import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LikeController } from './like/like.controller';
import { MetapostController } from './metapost/metapost.controller';
import { MetapostlistController } from './metapostlist/metapostlist.controller';
import { NotiController } from './noti/noti.controller';
import { NoticheckController } from './noticheck/noticheck.controller';
import { OauthController } from './oauth/oauth.controller';
import { PostController } from './post/post.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [],
  controllers: [AppController, LikeController, MetapostController, MetapostlistController, NotiController, NoticheckController, OauthController, PostController, UserController],
  providers: [AppService],
})
export class AppModule {}
