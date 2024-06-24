import { NotiRetrDto } from "../dto/noti-retr.dto";

export interface INotisRespDto {
  pageNum: number;
  pageSize: number;
  notifications: NotiRetrDto[];
}
