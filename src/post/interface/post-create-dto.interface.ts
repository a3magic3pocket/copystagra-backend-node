import { IPostCreateImageDto } from "./post-create-image-dto.interface";

export interface IPostCreateDto {
  description: string;
  ownerId: string;
  imageList: IPostCreateImageDto[];
}
