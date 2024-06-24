import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  NOTI_CHECK_COLLECTION_NAME,
  NOTI_CHECK_FIELDS,
  NotiCheck,
} from "./schema/noti-check.schema";

@Injectable()
export class NotiCheckRepository {
  constructor(
    @InjectModel(NOTI_CHECK_COLLECTION_NAME)
    private notiCheckModel: Model<NotiCheck>
  ) {}

  async findByOwnerId(ownerId: string): Promise<NotiCheck> {
    const condition = {
      [NOTI_CHECK_FIELDS.ownerId]: new Types.ObjectId(ownerId),
    };

    return this.notiCheckModel.findOne(condition);
  }

  async upsert(ownerId: string, checkedTime: string) {
    const query = { [NOTI_CHECK_FIELDS.ownerId]: new Types.ObjectId(ownerId) };
    const update = {
      $set: {
        [NOTI_CHECK_FIELDS.checkedTime]: checkedTime,
      },
    };
    const options = { upsert: true };

    return await this.notiCheckModel.updateOne(query, update, options);
  }
}
