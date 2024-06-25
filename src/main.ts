import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { IErrorRespDto } from "./global/dto/interface/error-resp-dto.interface";
import * as express from "express";
import * as fs from "fs";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
const MongoStore = require("connect-mongo");

async function bootstrap() {
  const port = 8080;
  const app = await NestFactory.create(AppModule);

  // 정적 파일 경로 설정
  const imageDirPath = `${process.env.STATIC_DIR_PATH}/${process.env.IMAGE_DIR_NAME}`;
  if (!fs.existsSync(imageDirPath)) {
    fs.mkdirSync(imageDirPath, { recursive: true });
  }
  app.use("/public", express.static(process.env.STATIC_DIR_PATH));

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
      secret: process.env.AUTH_COOKIE_SECRET,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: process.env.MONGDB_DATABASE_NAME,
        collectionName: process.env.MONGODB_SESSION_COLLECTION_NAME,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: process.env.AUTH_COOKIE_MAX_AGE
          ? parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10)
          : 6000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle("copystagram API Document")
    .setDescription(
      `*copystagram API 사용법<br /> 인증 - 브라우저에서 'http://localhost:${port}/oauth2/authorization/google'로 접속하여 구글 로그인하고 세션 쿠키 확보하면 인증이 필요한 API를 호출할 수 있습니다.`
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
