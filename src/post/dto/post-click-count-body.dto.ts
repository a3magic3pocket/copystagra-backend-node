import { Expose } from "class-transformer";
import { IsNotEmpty, Validate } from "class-validator";
import { isObjectId } from "src/global/validation/is-object-id.validation";

export class PostClickCountBodyDto {
  @Validate(isObjectId)
  @IsNotEmpty()
  @Expose({ name: "postId" })
  postId: string;
}
