import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
const MongoStore = require("connect-mongo");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
    maxAge: 3600,
  };
  app.enableCors(corsOptions);

  app.use(cookieParser());

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

  await app.listen(8080);
}
bootstrap();
