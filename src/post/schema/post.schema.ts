import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PostDocument = HydratedDocument<Post>;

export const POST_COLLECTION_NAME: string = "post";

@Schema({
  collection: POST_COLLECTION_NAME,
  versionKey: false,
})
export class Post {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageDirName: string;

  @Prop({ required: true })
  thumbImagePath: string;

  @Prop({ type: Types.Array })
  contentImagePaths: string[];

  @Prop({ type: Types.Buffer, unique: true })
  docHash: string;

  @Prop({ type: Date, required: true })
  createdAt: string;

  constructor(
    ownerId,
    description,
    imageDirName,
    thumbImagePath,
    contentImagePaths,
    docHash,
    createdAt,
    _id = null
  ) {
    if (_id) {
      this._id = _id;
    }

    this.ownerId = ownerId;
    this.description = description;
    this.imageDirName = imageDirName;
    this.thumbImagePath = thumbImagePath;
    this.contentImagePaths = contentImagePaths;
    this.docHash = docHash;
    this.createdAt = createdAt;
  }
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
