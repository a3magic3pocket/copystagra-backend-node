import { Expose } from "class-transformer";
import { IsNotEmpty, IsOptional, Validate } from "class-validator";
import { isObjectId } from "src/global/validation/is-object-id.validation";

export class LikeFormDataDto {
  @Validate(isObjectId)
  @IsNotEmpty()
  @Expose({ name: "postId" })
  postId: string;

  @Validate(isObjectId)
  @IsOptional()
  @Expose({ name: "hookPostId" })
  hookPostId: string;
}

export const LIKE_FORM_DATA_DTO_FIELDS = {
  postId: "postId",
  hookPostId: "hookPostId",
};
