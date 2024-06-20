import { Injectable } from "@nestjs/common";
import { LikeRepostory } from "./like.repository";
import { ILikeUpsertDto } from "./interface/like-upsert-dto.interface";
import { Like } from "./schema/like.schema";

@Injectable()
export class LikeService {
  constructor(private likeRepostory: LikeRepostory) {}

  async up(likeUpsertDto: ILikeUpsertDto) {
    const numLikes = 1;
    const like = new Like(
      likeUpsertDto.postId,
      likeUpsertDto.ownerId,
      numLikes
    );

    await this.likeRepostory.upsert(like);
  }

  async down(likeUpsertDto: ILikeUpsertDto) {
    const numLikes = 0;
    const like = new Like(
      likeUpsertDto.postId,
      likeUpsertDto.ownerId,
      numLikes
    );

    await this.likeRepostory.upsert(like);
  }
}
