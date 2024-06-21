import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type MetaPostDocument = HydratedDocument<MetaPost>;

export const META_POST_COLLECTION_NAME: string = "metaPost";

@Schema({
  collection: META_POST_COLLECTION_NAME,
  versionKey: false,
})
export class MetaPost {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  postId: string;

  @Prop({ type: Types.ObjectId, required: true })
  hookPostId: string;

  @Prop({ required: true })
  numViews: number;

  @Prop({ required: true })
  numLikes: number;

  @Prop({ required: true })
  numReplies: number;

  constructor(postId, hookPostId, numViews, numLikes, numReplies, _id = null) {
    if (_id) {
      this._id = _id;
    }

    this.postId = postId;
    this.hookPostId = hookPostId;
    this.numViews = numViews;
    this.numLikes = numLikes;
    this.numReplies = numReplies;
  }
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
