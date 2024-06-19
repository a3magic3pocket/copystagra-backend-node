import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { POST_COLLECTION_NAME, POST_FIELDS, Post } from "./schema/post.schema";
import { Model, PipelineStage, Types } from "mongoose";
import { USER_COLLECTION_NAME, USER_FIELDS } from "src/user/schema/user.schema";

@Injectable()
export class PostRepostory {
  constructor(
    @InjectModel(POST_COLLECTION_NAME) private postModel: Model<Post>
  ) {}

  async getLatestPostsLogic(
    skip: number,
    limit: number,
    criterias: PipelineStage[]
  ) {
    const OWNER_INFO = "ownerInfo";

    // prettier-ignore
    const posts = await this.postModel.aggregate([
      { 
        $lookup: {
          from: USER_COLLECTION_NAME,
          localField: POST_FIELDS.ownerId,
          foreignField: USER_FIELDS._id,
          as: OWNER_INFO,
        }
      },
      ...criterias,
      { $sort: { createdAt: -1}},
      { $skip: skip },
      { $limit: limit},
    ]).exec()

    return posts;
  }

  async getLatestPostsByUserId(skip: number, limit: number, ownerId: string) {
    const condition = {};
    condition[POST_FIELDS.ownerId] = new Types.ObjectId(ownerId);
    const crietrias = [{ $match: condition }];

    return await this.getLatestPostsLogic(skip, limit, crietrias);
  }

  async countPostsByUserId(ownerId: string) {
    const condition = {};
    condition[POST_FIELDS.ownerId] = new Types.ObjectId(ownerId);

    const countPosts = await this.postModel
      .countDocuments(condition, { isDeleted: false })
      .exec();

    return countPosts;
  }
}
