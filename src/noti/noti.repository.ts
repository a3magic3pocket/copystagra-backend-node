import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { NOTI_COLLECTION_NAME, NOTI_FIELDS, Noti } from "./schema/noti.schema";
import { USER_COLLECTION_NAME, USER_FIELDS } from "src/user/schema/user.schema";
import { NOTI_RETR_DTO_FIELDS, NotiRetrDto } from "./dto/noti-retr.dto";
import { POST_COLLECTION_NAME, POST_FIELDS } from "src/post/schema/post.schema";
import { convertTimeFieldToJavaTimeFormat } from "src/global/time/time-util";

@Injectable()
export class NotiRepository {
  constructor(
    @InjectModel(NOTI_COLLECTION_NAME) private notiModel: Model<Noti>
  ) {}

  async createNoti(noti: Noti) {
    const createdNoti = new this.notiModel(noti);
    return await createdNoti.save();
  }

  async getLatestNotisLogic(
    skip: number,
    limit: number,
    criterias: PipelineStage[]
  ) {
    const OWNER_INFO = "ownerInfo";
    const POST_INFO = "postInfo";

    const notis = await this.notiModel
      .aggregate([
        {
          $lookup: {
            from: USER_COLLECTION_NAME,
            localField: NOTI_FIELDS.ownerId,
            foreignField: USER_FIELDS._id,
            as: OWNER_INFO,
          },
        },
        {
          $set: {
            [NOTI_RETR_DTO_FIELDS.ownerName]: {
              $ifNull: [
                {
                  $arrayElemAt: [`$${OWNER_INFO}.${USER_FIELDS.name}`, 0],
                },
                null,
              ],
            },
          },
        },
        {
          $set: {
            [NOTI_RETR_DTO_FIELDS.ownerThumbImagePath]: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    `$${OWNER_INFO}.${USER_FIELDS.userImagePath}`,
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: POST_COLLECTION_NAME,
            localField: NOTI_FIELDS.relatedPostId,
            foreignField: POST_FIELDS._id,
            as: POST_INFO,
          },
        },
        {
          $set: {
            [NOTI_RETR_DTO_FIELDS.postThumbImagePath]: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    `$${POST_INFO}.${POST_FIELDS.thumbImagePath}`,
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $set: {
            [NOTI_RETR_DTO_FIELDS.notiId]: `$${POST_FIELDS._id}`,
          },
        },
        ...criterias,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            [NOTI_FIELDS._id]: 0,
            [NOTI_RETR_DTO_FIELDS.notiId]: 1,
            [NOTI_RETR_DTO_FIELDS.ownerName]: 1,
            [NOTI_RETR_DTO_FIELDS.ownerThumbImagePath]: 1,
            [NOTI_RETR_DTO_FIELDS.content]: 1,
            [NOTI_RETR_DTO_FIELDS.relatedPostId]: 1,
            [NOTI_RETR_DTO_FIELDS.postThumbImagePath]: 1,
            [NOTI_RETR_DTO_FIELDS.createdAt]: 1,
          },
        },
      ])
      .exec();

    const newNotis = convertTimeFieldToJavaTimeFormat(notis, [
      NOTI_FIELDS.createdAt,
    ]) as NotiRetrDto[];

    return newNotis;
  }

  async getLatestNotis(
    skip: number,
    limit: number,
    ownerId: string
  ): Promise<NotiRetrDto[]> {
    const condition = {
      [NOTI_FIELDS.ownerId]: new Types.ObjectId(ownerId),
    };
    const crietrias = [{ $match: condition }];

    return await this.getLatestNotisLogic(skip, limit, crietrias);
  }
  async getMyUncheckedNotis(
    skip: number,
    limit: number,
    ownerId: string,
    notiCheckedDate: string
  ): Promise<Noti[]> {
    const criterias = [
      {
        $match: {
          [NOTI_FIELDS.ownerId]: new Types.ObjectId(ownerId),
          [NOTI_FIELDS.createdAt]: {
            $gt: new Date(notiCheckedDate),
          },
        },
      },
    ];

    const notis: Noti[] = await this.notiModel.aggregate(criterias).exec();

    return notis;
  }
}
