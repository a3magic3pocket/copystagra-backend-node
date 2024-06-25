import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { POST_COLLECTION_NAME, POST_FIELDS, Post } from "./schema/post.schema";
import { Model, PipelineStage, Types } from "mongoose";
import { USER_COLLECTION_NAME, USER_FIELDS } from "@src/user/schema/user.schema";
import { LIKE_COLLECTION_NAME, LIKE_FIELDS } from "@src/like/schema/like.schema";
import { POST_RESP_DTO_FIELDS, PostRespDto } from "./dto/post-resp.dto";
import {
  META_POST_COLLECTION_NAME,
  META_POST_FIELDS,
} from "@src/metapost/schema/meta-post.schema";
import { convertTimeFieldToJavaTimeFormat } from "@src/global/time/time-util";

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(POST_COLLECTION_NAME) private postModel: Model<Post>
  ) {}

  async createPost(post: Post) {
    const createdPost = new this.postModel(post);
    return await createdPost.save();
  }

  private async getLatestPostsLogic(
    skip: number,
    limit: number,
    criterias: PipelineStage[]
  ) {
    const OWNER_INFO = "ownerInfo";
    const LIKE_INFO = "likeInfo";

    const posts = await this.postModel
      .aggregate([
        {
          $lookup: {
            from: USER_COLLECTION_NAME,
            localField: POST_FIELDS.ownerId,
            foreignField: USER_FIELDS._id,
            as: OWNER_INFO,
          },
        },
        {
          $lookup: {
            from: LIKE_COLLECTION_NAME,
            localField: POST_FIELDS._id,
            foreignField: LIKE_FIELDS.postId,
            as: LIKE_INFO,
          },
        },
        {
          $set: {
            [POST_RESP_DTO_FIELDS.ownerName]: {
              $ifNull: [
                {
                  $arrayElemAt: [`$${OWNER_INFO}.${USER_FIELDS.name}`, 0],
                },
                null,
              ],
            },
          },
        },
        {
          $set: {
            [POST_RESP_DTO_FIELDS.postId]: `$${POST_FIELDS._id}`,
          },
        },
        {
          $set: {
            [POST_RESP_DTO_FIELDS.numLikes]: {
              $ifNull: [
                {
                  $arrayElemAt: [`$${LIKE_INFO}.${LIKE_FIELDS.numLikes}`, 0],
                },
                0,
              ],
            },
          },
        },
        ...criterias,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            [POST_FIELDS._id]: 0,
            [POST_RESP_DTO_FIELDS.postId]: 1,
            [POST_RESP_DTO_FIELDS.ownerName]: 1,
            [POST_RESP_DTO_FIELDS.description]: 1,
            [POST_RESP_DTO_FIELDS.thumbImagePath]: 1,
            [POST_RESP_DTO_FIELDS.numLikes]: 1,
            [POST_RESP_DTO_FIELDS.contentImagePaths]: 1,
            [POST_RESP_DTO_FIELDS.createdAt]: 1,
          },
        },
      ])
      .exec();

    const postRespDtos = convertTimeFieldToJavaTimeFormat(posts, [
      POST_FIELDS.createdAt,
    ]) as PostRespDto[];

    return postRespDtos;
  }

  async getLatestAllPosts(skip: number, limit: number) {
    return await this.getLatestPostsLogic(skip, limit, []);
  }

  async getLatestPostsByUserId(skip: number, limit: number, ownerId: string) {
    const condition = {
      [POST_FIELDS.ownerId]: new Types.ObjectId(ownerId),
    };
    const crietrias = [{ $match: condition }];

    return await this.getLatestPostsLogic(skip, limit, crietrias);
  }

  async countPostsByUserId(ownerId: string) {
    const condition = {
      [POST_FIELDS.ownerId]: new Types.ObjectId(ownerId),
    };

    const countPosts = await this.postModel
      .countDocuments(condition, { isDeleted: false })
      .exec();

    return countPosts;
  }

  async getRelatedAllPosts(skip: number, limit: number, hookPostId: string) {
    const OWNER_INFO = "ownerInfo";
    const META_POST_INFO = "metaPostInfo";
    const LIKE_INFO = "likeInfo";
    const POPULAR_INDEX = "popularIndex";

    const posts: PostRespDto[] = await this.postModel
      .aggregate([
        {
          $lookup: {
            from: USER_COLLECTION_NAME,
            localField: POST_FIELDS.ownerId,
            foreignField: USER_FIELDS._id,
            as: OWNER_INFO,
          },
        },
        {
          $lookup: {
            from: META_POST_COLLECTION_NAME,
            localField: POST_FIELDS._id,
            foreignField: META_POST_FIELDS.postId,
            pipeline: [
              {
                $match: {
                  [META_POST_FIELDS.hookPostId]: new Types.ObjectId(hookPostId),
                },
              },
            ],
            as: META_POST_INFO,
          },
        },
        {
          $lookup: {
            from: LIKE_COLLECTION_NAME,
            localField: POST_FIELDS._id,
            foreignField: LIKE_FIELDS.postId,
            as: LIKE_INFO,
          },
        },
        {
          $set: {
            [POST_RESP_DTO_FIELDS.ownerName]: {
              $ifNull: [
                {
                  $arrayElemAt: [`$${OWNER_INFO}.${USER_FIELDS.name}`, 0],
                },
                null,
              ],
            },
          },
        },
        {
          $set: {
            [POST_RESP_DTO_FIELDS.postId]: `$${POST_FIELDS._id}`,
          },
        },
        {
          $set: {
            [POST_RESP_DTO_FIELDS.numLikes]: {
              $ifNull: [
                {
                  $arrayElemAt: [`$${LIKE_INFO}.${LIKE_FIELDS.numLikes}`, 0],
                },
                0,
              ],
            },
          },
        },
        {
          $set: {
            [POPULAR_INDEX]: {
              $divide: [
                {
                  $ifNull: [
                    {
                      $arrayElemAt: [
                        `$${LIKE_INFO}.${LIKE_FIELDS.numLikes}`,
                        0,
                      ],
                    },
                    0,
                  ],
                },
                {
                  $add: [
                    {
                      $ifNull: [
                        {
                          $arrayElemAt: [
                            `$${META_POST_INFO}.${META_POST_FIELDS.numViews}`,
                            0,
                          ],
                        },
                        0,
                      ],
                    },
                    0.00000000001,
                  ],
                },
              ],
            },
          },
        },
        { $sort: { [POPULAR_INDEX]: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            [POST_FIELDS._id]: 0,
            [POST_RESP_DTO_FIELDS.postId]: 1,
            [POST_RESP_DTO_FIELDS.ownerName]: 1,
            [POST_RESP_DTO_FIELDS.description]: 1,
            [POST_RESP_DTO_FIELDS.thumbImagePath]: 1,
            [POST_RESP_DTO_FIELDS.numLikes]: 1,
            [POST_RESP_DTO_FIELDS.contentImagePaths]: 1,
            [POST_RESP_DTO_FIELDS.createdAt]: 1,
          },
        },
      ])
      .exec();

    const postRespDtos = convertTimeFieldToJavaTimeFormat(posts, [
      POST_FIELDS.createdAt,
    ]) as PostRespDto[];

    return postRespDtos;
  }

  async existsById(postId: string) {
    const condition = {
      [POST_FIELDS._id]: new Types.ObjectId(postId),
    };

    const result = await this.postModel.exists(condition).exec();

    return result !== null;
  }
}
