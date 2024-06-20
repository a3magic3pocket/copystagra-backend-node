import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type LikeDocument = HydratedDocument<Like>;

export const LIKE_COLLECTION_NAME: string = "like";

@Schema({
  collection: LIKE_COLLECTION_NAME,
  versionKey: false,
})
export class Like {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  postId: string;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: string;

  @Prop({ required: true })
  numLikes: number;

  constructor(
    postId: string,
    ownerId: string,
    numLikes: number,
    _id?: Types.ObjectId
  ) {
    if (_id) {
      this._id = _id;
    }

    this.postId = postId;
    this.ownerId = ownerId;
    this.numLikes = numLikes;
  }
}

export const LikeSchema = SchemaFactory.createForClass(Like);

export const LIKE_FIELDS = {
  _id: "_id",
  postId: "postId",
  ownerId: "ownerId",
  numLikes: "numLikes",
};
