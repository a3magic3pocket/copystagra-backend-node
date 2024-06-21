import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { IErrorRespDto } from "./global/dto/interface/error-resp-dto.interface";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
const MongoStore = require("connect-mongo");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: process.env.KAFKA_CLIENT_ID,
  //       brokers: [process.env.KAFKA_CLIENT_BOOTSTRAP_SERVER],
  //     },
  //     consumer: {
  //       groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
  //     },
  //     run: {
  //       autoCommit: false,
  //     },
  //   },
  // });

  // CORS 설정
  const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
    maxAge: 3600,
  };
  app.enableCors(corsOptions);

  // 쿠키 제어
  app.use(cookieParser());

  // 유효성 검증
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errorInfos = validationErrors.map((error) => ({
          field: error.property,
          error: Object.values(error.constraints),
        }));

        const errorRespDto: IErrorRespDto = {
          code: "9999",
          locale: "en",
          message: errorInfos,
        };

        return new BadRequestException(errorRespDto);
      },
    })
  );

  // 세션 설정
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
        maxAge: 600000000000,
        secure: false,
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.startAllMicroservices();
  await app.listen(8080);
}
bootstrap();
