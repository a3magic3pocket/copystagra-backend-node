import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  NOTI_MAP_COLLECTION_NAME,
  NOTI_MAP_FIELDS,
  NotiMap,
} from "./schema/noti-map.schema";

@Injectable()
export class NotiMapRepository {
  constructor(
    @InjectModel(NOTI_MAP_COLLECTION_NAME) private notiMapModel: Model<NotiMap>
  ) {}

  async findByNotiCode(code: string): Promise<NotiMap> {
    const condition = {
      [NOTI_MAP_FIELDS.code]: code,
    };

    return await this.notiMapModel.findOne(condition);
  }
}
