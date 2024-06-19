import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

export const USER_COLLECTION_NAME: string = "user";

@Schema({ collection: USER_COLLECTION_NAME, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  openId: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, type: Boolean })
  isActive: string;

  @Prop()
  locale: string;

  @Prop()
  description: string;

  @Prop()
  userImagePath: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const USER_FIELDS = {
  _id: "_id",
  email: "email",
  openId: "openId",
  name: "name",
  provider: "provider",
  role: "role",
  isActive: "isActive",
  locale: "locale",
  description: "description",
  userImagePath: "userImagePath",
};
