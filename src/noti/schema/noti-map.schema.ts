import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type NotiMapDocument = HydratedDocument<NotiMap>;

export const NOTI_MAP_COLLECTION_NAME: string = "notiMap";

@Schema({
  collection: NOTI_MAP_COLLECTION_NAME,
  versionKey: false,
})
export class NotiMap {
  _id: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  locale: string;
  
  @Prop({ required: true })
  content: string;
}

export const NotiMapSchema = SchemaFactory.createForClass(NotiMap);

export const NOTI_MAP_FIELDS = {
  _id: "_id",
  code: "code",
  locale: "locale",
  content: "content",
};
