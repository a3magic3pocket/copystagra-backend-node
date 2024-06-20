import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { LIKE_COLLECTION_NAME, LIKE_FIELDS, Like } from "./schema/like.schema";

@Injectable()
export class LikeRepostory {
  constructor(
    @InjectModel(LIKE_COLLECTION_NAME) private likeModel: Model<Like>
  ) {}

  async upsert(like: Like) {
    const query = {
      [LIKE_FIELDS.ownerId]: new Types.ObjectId(like.ownerId),
      [LIKE_FIELDS.postId]: new Types.ObjectId(like.postId),
    };
    const update = {
      $set: {
        [LIKE_FIELDS.numLikes]: like.numLikes,
      },
    };
    const options = { upsert: true };

    return await this.likeModel.updateOne(query, update, options);
  }
}
