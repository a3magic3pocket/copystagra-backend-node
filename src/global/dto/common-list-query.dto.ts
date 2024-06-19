import { Expose } from "class-transformer";
import { IsInt, IsNumberString, IsOptional, Validate } from "class-validator";
import { IsNaturalNumber } from "../validation/is-natural-number.validation";

export class CommonListQueryDto {
  @Validate(IsNaturalNumber)
  @IsNumberString()
  @IsOptional()
  @Expose({ name: "page-num" })
  pageNum: number;

  @Validate(IsNaturalNumber)
  @IsNumberString()
  @IsOptional()
  @Expose({ name: "page-size" })
  pageSize: number;
}
