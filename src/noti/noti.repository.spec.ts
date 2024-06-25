import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import {
  initTestMongodb,
  getTestMongodbUri,
  disconnectTestMongodb,
} from "@test/momory-mongodb-setup";
import {
  USER_COLLECTION_NAME,
  User,
  UserSchema,
} from "@src/user/schema/user.schema";
import { UserRepository } from "@src/user/user.repository";
import { IUserCreateDto } from "@src/user/interface/user-create-dto.interface";
import { USER_ROLE } from "@src/user/user-role";
import { getKorTime } from "@src/global/time/time-util";
import { NotiRepository } from "./noti.repository";
import { NOTI_COLLECTION_NAME, Noti, NotiSchema } from "./schema/noti.schema";
import { getSha256Buffer } from "@src/global/crypto/hash";
import { PostRepository } from "@src/post/post.repository";
import {
  POST_COLLECTION_NAME,
  Post,
  PostSchema,
} from "@src/post/schema/post.schema";

describe("NotiRepository", () => {
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let notiRepository: NotiRepository;
  let newUser: User;
  let newPost: Post;
  let newNoti: Noti;

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
          { name: POST_COLLECTION_NAME, schema: PostSchema },
        ]),
        MongooseModule.forFeature([
          { name: NOTI_COLLECTION_NAME, schema: NotiSchema },
        ]),
      ],
      providers: [UserRepository, PostRepository, NotiRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    postRepository = module.get<PostRepository>(PostRepository);
    notiRepository = module.get<NotiRepository>(NotiRepository);

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
    const postDocHash = await getSha256Buffer("post1");
    const post = new Post(
      newUser._id,
      "hello description",
      "/imageDirName",
      "/thumbImagePathForDb",
      ["/contentImagePathsForDb/1", "/contentImagePathsForDb/2"],
      Buffer.from(postDocHash),
      createdAt
    );
    newPost = await postRepository.createPost(post);

    const notiDocHash = await getSha256Buffer("noti1");
    const noti = new Noti(
      newUser._id,
      "content1",
      newPost._id,
      Buffer.from(notiDocHash),
      createdAt
    );
    newNoti = await notiRepository.createNoti(noti);
  });

  afterAll(async () => {
    await disconnectTestMongodb();
  });

  it("should be defined", () => {
    expect(userRepository).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(notiRepository).toBeDefined();
  });

  describe("list", () => {
    it("getLatestNotis", async () => {
      const foundNotis = await notiRepository.getLatestNotis(
        0,
        10,
        newUser._id.toString()
      );
      expect(foundNotis.length).toBe(1);
    });

    it("getMyUncheckedNotis", async () => {
      const initialTime = new Date("1899-01-01T00:00:00");
      const foundNotis = await notiRepository.getMyUncheckedNotis(
        0,
        10,
        newUser._id.toString(),
        initialTime.toISOString()
      );
      expect(foundNotis.length).toBe(1);
    });
  });
});
