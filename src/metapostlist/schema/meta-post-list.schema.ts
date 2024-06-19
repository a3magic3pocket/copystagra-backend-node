import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type MetaPostListDocument = HydratedDocument<MetaPostList>;

export const META_POST_LIST_COLLECTION_NAME: string = "metaPostList";

@Schema({
  collection: META_POST_LIST_COLLECTION_NAME,
  versionKey: false,
})
export class MetaPostList {
  _id: Types.ObjectId;
  postId: string;
  numClicks: number;
  numViews: number;
}

export const MetaPostListSchema = SchemaFactory.createForClass(MetaPostList);

export const POST_FIELDS = {
  _id: "_id",
  postId: "postId",
  numClicks: "numClicks",
  numViews: "numViews",
};
