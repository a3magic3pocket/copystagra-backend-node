import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type MetaPostDocument = HydratedDocument<MetaPost>;

export const META_POST_COLLECTION_NAME: string = "metaPost";

@Schema({
  collection: META_POST_COLLECTION_NAME,
  versionKey: false,
})
export class MetaPost {
  _id: Types.ObjectId;
  postId: string;
  hookPostId: string;
  numViews: number;
  numLikes: number;
  numReplies: number;
}

export const MetaPostSchema = SchemaFactory.createForClass(MetaPost);

export const META_POST_FIELDS = {
  _id: "_id",
  postId: "postId",
  hookPostId: "hookPostId",
  numViews: "numViews",
  numLikes: "numLikes",
  numReplies: "numReplies",
};
