import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";

export class PostCreateBodyDto {
  @ApiProperty({ type: "string", format: "string" })
  // 자바 코드 호환을 위한 에러처리
  @Length(0, 1000, { message: "문구는 1000자 이하만 입력할 수 있습니다." })
  // 자바 코드 호환을 위한 에러처리
  @IsNotEmpty({ message: "문구를 입력해주세요." })
  @Expose({ name: "description" })
  description: string;
}
