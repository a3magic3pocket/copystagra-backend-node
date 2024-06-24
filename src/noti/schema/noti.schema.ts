import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type NotiDocument = HydratedDocument<Noti>;

export const NOTI_COLLECTION_NAME: string = "noti";

@Schema({
  collection: NOTI_COLLECTION_NAME,
  timestamps: {
    createdAt: "createdAt",
  },
  versionKey: false,
})
export class Noti {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, unique: true, required: true })
  ownerId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, required: true })
  relatedPostId: string;

  @Prop({ type: Types.Buffer, required: true })
  docHash: string;

  @Prop({ type: Date, required: true })
  createdAt: string;

  constructor(ownerId, content, relatedPostId, docHash, createdAt, _id = null) {
    if (_id) {
      this._id = _id;
    }

    this.ownerId = ownerId;
    this.content = content;
    this.relatedPostId = relatedPostId;
    this.docHash = docHash;
    this.createdAt = createdAt;
  }
}

export const NotiSchema = SchemaFactory.createForClass(Noti);

export const NOTI_FIELDS = {
  _id: "_id",
  ownerId: "ownerId",
  content: "content",
  relatedPostId: "relatedPostId",
  docHash: "docHash",
  createdAt: "createdAt",
};
