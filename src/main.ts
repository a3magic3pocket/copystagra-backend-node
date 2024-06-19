import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
const MongoStore = require("connect-mongo");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: "asdfasdfasdfasdf",
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: process.env.MONGDB_DATABASE_NAME,
        collectionName: process.env.MONGODB_SESSION_COLLECTION_NAME,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
        secure: false,
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cookieParser());

  await app.listen(8080);
}
bootstrap();
