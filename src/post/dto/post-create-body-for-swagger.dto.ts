import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { PostCreateBodyDto } from "./post-create-body.dto";

export class PostCreateBodyForSwaggerDto extends PostCreateBodyDto {
  @ApiProperty({ type: "string", format: "binary" })
  @IsNotEmpty()
  file: any;
}
