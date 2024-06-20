import { Expose } from "class-transformer";
import { IsNotEmpty, Validate } from "class-validator";
import { CommonListQueryDto } from "src/global/dto/common-list-query.dto";
import { isObjectId } from "src/global/validation/is-object-id.validation";

export class RelatedPostsListQueryDto extends CommonListQueryDto {
  @Validate(isObjectId)
  @IsNotEmpty()
  @Expose({ name: "hook-post-id" })
  hookPostId: string;
}
