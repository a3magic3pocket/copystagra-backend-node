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

  createdAt: string;
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
