import { Test, TestingModule } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { USER_COLLECTION_NAME, UserSchema } from "./schema/user.schema";
import { IUserCreateDto } from "./interface/user-create-dto.interface";
import { USER_ROLE } from "./user-role";
import { MongooseModule } from "@nestjs/mongoose";
import {
  initTestMongodb,
  getTestMongodbUri,
  disconnectTestMongodb,
} from "@test/momory-mongodb-setup";

describe("UserRepository", () => {
  let repository: UserRepository;
  const newUser: IUserCreateDto = {
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

  beforeAll(async () => {
    await initTestMongodb();
    const testMongodbUri = getTestMongodbUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(testMongodbUri),
        MongooseModule.forFeature([
          { name: USER_COLLECTION_NAME, schema: UserSchema },
        ]),
      ],
      providers: [UserRepository],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    await repository.create(newUser);
  });

  afterAll(async () => {
    await disconnectTestMongodb();
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("findOne", () => {
    it("findByEmail", async () => {
      const user = await repository.findByEmail(newUser.email);
      expect(user).not.toEqual(undefined || null);
      expect(user.name).toEqual(user.name);
      expect(user._id).not.toEqual(undefined || null);
      expect(typeof user._id.toString()).toEqual("string");
    });

    it("findById", async () => {
      const originUser = await repository.findByEmail(newUser.email);
      const foundUser = await repository.findById(originUser._id.toString());
      expect(originUser).toEqual(foundUser);
    });

    it("findByName", async () => {
      const originUser = await repository.findByEmail(newUser.email);
      const foundUser = await repository.findByName(newUser.name);
      expect(originUser).toEqual(foundUser);
    });
  });
});
