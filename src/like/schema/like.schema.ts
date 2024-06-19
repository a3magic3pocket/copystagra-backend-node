import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type LikeDocument = HydratedDocument<Like>;

export const LIKE_COLLECTION_NAME: string = "like";

@Schema({
  collection: LIKE_COLLECTION_NAME,
  timestamps: {
    createdAt: "createdAt",
  },
})
export class Like {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  postId: string;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: string;

  numLikes: number;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

export const LIKE_FIELDS = {
  _id: "_id",
  postId: "postId",
  ownerId: "ownerId",
  numLikes: "numLikes",
};
