import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import {
  initTestMongodb,
  getTestMongodbUri,
  disconnectTestMongodb,
} from "@test/momory-mongodb-setup";
import { POST_COLLECTION_NAME, Post, PostSchema } from "./schema/post.schema";
import { UserRepository } from "@src/user/user.repository";
import { PostRepository } from "./post.repository";
import {
  USER_COLLECTION_NAME,
  User,
  UserSchema,
} from "@src/user/schema/user.schema";
import { IUserCreateDto } from "@src/user/interface/user-create-dto.interface";
import { USER_ROLE } from "@src/user/user-role";
import { getSha256Buffer } from "@src/global/crypto/hash";
import { getKorTime } from "@src/global/time/time-util";

describe("PostRepository", () => {
  let postRepository: PostRepository;
  let userRepository: UserRepository;
  let newUser: User;
  let newPost: Post;

  beforeAll(async () => {
    await initTestMongodb();
    const testMongodbUri = getTestMongodbUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(testMongodbUri),
        MongooseModule.forFeature([
          { name: POST_COLLECTION_NAME, schema: PostSchema },
        ]),
        MongooseModule.forFeature([
          { name: USER_COLLECTION_NAME, schema: UserSchema },
        ]),
      ],
      providers: [PostRepository, UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    postRepository = module.get<PostRepository>(PostRepository);

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

    const docHash = await getSha256Buffer("hello-my-friend-asdfasd");
    const createdAt = getKorTime(new Date()).toISOString();
    const post = new Post(
      newUser._id,
      "hello description",
      "/imageDirName",
      "/thumbImagePathForDb",
      ["/contentImagePathsForDb/1", "/contentImagePathsForDb/2"],
      Buffer.from(docHash),
      createdAt
    );
    newPost = await postRepository.createPost(post);
  });

  afterAll(async () => {
    await disconnectTestMongodb();
  });

  it("should be defined", () => {
    expect(userRepository).toBeDefined();
    expect(postRepository).toBeDefined();
  });

  describe("findOne", () => {
    it("existsById", async () => {
      expect(newPost).not.toEqual(undefined);
      const exists = await postRepository.existsById(newPost._id.toString());
      expect(exists).toEqual(true);
    });
  });

  describe("count", () => {
    it("countPostsByUserId", async () => {
      const count = await postRepository.countPostsByUserId(
        newUser._id.toString()
      );
      expect(count).toBe(1);
    });
  });

  describe("list", () => {
    it("prepare", async () => {
      // user1의 새 포스트 추가
      const docHash2 = await getSha256Buffer("hello-my-friend-asdfasd22");
      const createdAt2 = getKorTime(new Date()).toISOString();
      const post2 = new Post(
        newUser._id,
        "hello description2",
        "/imageDirName2",
        "/thumbImagePathForDb2",
        ["/contentImagePathsForDb2/1", "/contentImagePathsForDb2/2"],
        Buffer.from(docHash2),
        createdAt2
      );
      const newPost2 = await postRepository.createPost(post2);
      expect(newPost2).not.toEqual(undefined || null);

      // user2 추가
      const user2: IUserCreateDto = {
        email: "hello2@world.com",
        openId: "123asdfasdfa222222",
        name: "my-id22",
        provider: "google",
        role: USER_ROLE.NORMAL,
        isActive: true,
        locale: "ko",
        description: "hello world",
        userImagePath: null,
      };
      const newUser2 = await userRepository.create(user2);
      expect(newUser2).not.toEqual(undefined || null);

      // user2의 포스트 추가
      const docHash3 = await getSha256Buffer("hello-my-friend-asdfasd33");
      const createdAt3 = getKorTime(new Date()).toISOString();
      const post3 = new Post(
        newUser2._id,
        "hello description3",
        "/imageDirName3",
        "/thumbImagePathForDb3",
        ["/contentImagePathsForDb3/1", "/contentImagePathsForDb3/2"],
        Buffer.from(docHash3),
        createdAt3
      );
      const newPost3 = await postRepository.createPost(post3);
      expect(newPost3).not.toEqual(undefined || null);
    });

    it("getLatestAllPosts", async () => {
      const posts = await postRepository.getLatestAllPosts(0, 10);
      expect(posts.length).toBe(3);
    });

    it("getLatestPostsByUserId", async () => {
      const posts = await postRepository.getLatestPostsByUserId(
        0,
        10,
        newUser._id.toString()
      );
      expect(posts.length).toBe(2);
    });

    it("getLatestPostsByUserId", async () => {
      const posts = await postRepository.getRelatedAllPosts(
        0,
        10,
        newPost._id.toString()
      );
      expect(posts.length).toBe(3);
    });
  });
});
