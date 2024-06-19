import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type NotiCheckDocument = HydratedDocument<NotiCheck>;

export const NOTI_CHECK_COLLECTION_NAME: string = "notiCheck";

@Schema({
  collection: NOTI_CHECK_COLLECTION_NAME,
  timestamps: {
    createdAt: "createdAt",
  },
})
export class NotiCheck {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, unique: true, required: true })
  ownerId: string;

  @Prop({ required: true })
  checkedTime: string;
}

export const NotiCheckSchema = SchemaFactory.createForClass(NotiCheck);

export const NOTI_CHECK_FIELDS = {
  _id: "_id",
  ownerId: "ownerId",
  checkedTime: "checkedTime",
};