import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import {
  initTestMongodb,
  getTestMongodbUri,
  disconnectTestMongodb,
} from "@test/momory-mongodb-setup";
import { NotiCheckRepository } from "./noti-check.repository";
import {
  USER_COLLECTION_NAME,
  User,
  UserSchema,
} from "@src/user/schema/user.schema";
import { UserRepository } from "@src/user/user.repository";
import { IUserCreateDto } from "@src/user/interface/user-create-dto.interface";
import { USER_ROLE } from "@src/user/user-role";
import { getKorTime } from "@src/global/time/time-util";
import {
  NOTI_CHECK_COLLECTION_NAME,
  NotiCheck,
  NotiCheckSchema,
} from "./schema/noti-check.schema";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let notiCheckRepository: NotiCheckRepository;
  let newUser: User;
  let newNotiCheck: NotiCheck;

  beforeAll(async () => {
    await initTestMongodb();
    const testMongodbUri = getTestMongodbUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(testMongodbUri),
        MongooseModule.forFeature([
          { name: USER_COLLECTION_NAME, schema: UserSchema },
        ]),
        MongooseModule.forFeature([
          { name: NOTI_CHECK_COLLECTION_NAME, schema: NotiCheckSchema },
        ]),
      ],
      providers: [UserRepository, NotiCheckRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    notiCheckRepository = module.get<NotiCheckRepository>(NotiCheckRepository);

    const user: IUserCreateDto = {
      email: "hello@world.com",
      openId: "123asdfasdfa",
      name: "my-id",
      provider: "google",
      role: USER_ROLE.NORMAL,
      isActive: true,
      locale: "ko",
      description: "hello world",
      userImagePath: null,
    };
    newUser = await userRepository.create(user);

    const createdAt = getKorTime(new Date()).toISOString();
    const upsertResult = await notiCheckRepository.upsert(
      newUser._id.toString(),
      createdAt
    );
    expect(upsertResult.upsertedId).not.toEqual(undefined || null);
    newNotiCheck = new NotiCheck(
      newUser._id,
      createdAt,
      upsertResult.upsertedId
    );
  });

  afterAll(async () => {
    await disconnectTestMongodb();
  });

  it("should be defined", () => {
    expect(userRepository).toBeDefined();
    expect(notiCheckRepository).toBeDefined();
  });

  describe("findOne", () => {
    it("findByEmail", async () => {
      const foundNotiCheck = await notiCheckRepository.findByOwnerId(
        newUser._id.toString()
      );
      expect(foundNotiCheck).not.toEqual(undefined || null);
      expect(newNotiCheck._id).toEqual(foundNotiCheck._id);
    });
  });

  describe("upsert", () => {
    it("upsert", async () => {
      const targetCreatedAt = getKorTime(new Date()).toISOString();
      const upsertResult = await notiCheckRepository.upsert(
        newUser._id.toString(),
        targetCreatedAt
      );
      expect(upsertResult.acknowledged).toBeTruthy();
      expect(upsertResult.matchedCount).toEqual(1);
      expect(upsertResult.modifiedCount).toEqual(1);

      const foundNotiCheck = await notiCheckRepository.findByOwnerId(
        newUser._id.toString()
      );
      expect(foundNotiCheck.checkedTime).toEqual(new Date(targetCreatedAt));
    });
  });
});
