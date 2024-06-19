import { NotiRetrDto } from "../noti-retr.dto";

export interface INotisRespDto {
  pageNum: number;
  pageSize: number;
  notifications: NotiRetrDto[];
}
