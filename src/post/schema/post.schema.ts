import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

export const POST_COLLECTION_NAME: string = "post";

@Schema({
  collection: POST_COLLECTION_NAME,
  timestamps: {
    createdAt: "createdAt",
  },
  versionKey: false,
})
export class Post {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  ownerId: string;

  description: string;

  imageDirName: string;

  thumbImagePath: string;

  @Prop({ type: Types.Array })
  contentImagePaths: string[];

  @Prop({ type: Types.Buffer, unique: true })
  docHash: string;

  createdAt: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

export const POST_FIELDS = {
  _id: "_id",
  ownerId: "ownerId",
  description: "description",
  imageDirName: "imageDirName",
  thumbImagePath: "thumbImagePath",
  contentImagePaths: "contentImagePaths",
  docHash: "docHash",
  createdAt: "createdAt",
};
