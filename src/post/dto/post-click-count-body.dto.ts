import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, Validate } from "class-validator";
import { isObjectId } from "src/global/validation/is-object-id.validation";

export class PostClickCountBodyDto {
  @ApiProperty({ type: "string", format: "string" })
  @Validate(isObjectId)
  @IsNotEmpty()
  @Expose({ name: "postId" })
  postId: string;
}
