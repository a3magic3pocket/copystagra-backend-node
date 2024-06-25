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
import { LIKE_COLLECTION_NAME, Like, LikeSchema } from "./schema/like.schema";
import { LikeRepostory } from "./like.repository";
import {
  POST_COLLECTION_NAME,
  Post,
  PostSchema,
} from "@src/post/schema/post.schema";
import { PostRepository } from "@src/post/post.repository";
import { getSha256Buffer } from "@src/global/crypto/hash";

describe("LikeRepostory", () => {
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let likeRepostory: LikeRepostory;
  let newUser: User;
  let newPost: Post;
  let newLike: Like;

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
          { name: LIKE_COLLECTION_NAME, schema: LikeSchema },
        ]),
      ],
      providers: [UserRepository, PostRepository, LikeRepostory],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    postRepository = module.get<PostRepository>(PostRepository);
    likeRepostory = module.get<LikeRepostory>(LikeRepostory);

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

    const numLikes = 1;
    const like = new Like(
      newPost._id.toString(),
      newUser._id.toString(),
      numLikes
    );

    const upsertResult = await likeRepostory.upsert(like);
    expect(upsertResult.upsertedId).not.toEqual(undefined || null);
    newLike = new Like(
      like.postId,
      like.ownerId,
      like.numLikes,
      upsertResult.upsertedId
    );
  });

  afterAll(async () => {
    await disconnectTestMongodb();
  });

  it("should be defined", () => {
    expect(userRepository).toBeDefined();
    expect(likeRepostory).toBeDefined();
  });

  describe("findOne", () => {
    it("upsert", async () => {
      const foundlike = await likeRepostory.findById(newLike._id.toString());
      expect(foundlike).not.toEqual(undefined || null);
      expect(foundlike._id).toEqual(newLike._id);
    });
  });

  describe("upsert", () => {
    it("upsert", async () => {
      const numLikes2 = 0;
      const newLike2 = new Like(
        newLike.postId.toString(),
        newLike.ownerId.toString(),
        numLikes2
      );
      const upsertResult = await likeRepostory.upsert(newLike2);
      expect(upsertResult.acknowledged).toBeTruthy();
      expect(upsertResult.matchedCount).toEqual(1);
      expect(upsertResult.modifiedCount).toEqual(1);

      const foundNotiCheck = await likeRepostory.findById(
        newLike._id.toString()
      );
      expect(foundNotiCheck.numLikes).not.toEqual(newLike.numLikes);
      expect(foundNotiCheck.numLikes).toEqual(numLikes2);
    });
  });
});
