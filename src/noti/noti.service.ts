import { Injectable } from "@nestjs/common";
import { NotiRepository } from "./noti.repository";
import { NotiCheckRepository } from "src/noticheck/noti-check.repository";
import { NotiRetrDto } from "./dto/noti-retr.dto";

@Injectable()
export class NotiService {
  constructor(
    private notiRepository: NotiRepository,
    private notiCheckRepository: NotiCheckRepository
  ) {}

  async getLatestNotis(
    pageNum: number,
    pageSize: number,
    ownerId: string
  ): Promise<NotiRetrDto[]> {
    const skip = (pageNum - 1) * pageSize;
    return await this.notiRepository.getLatestNotis(skip, pageSize, ownerId);
  }

  async getMyUncheckedNotis(
    pageNum: number,
    pageSize: number,
    ownerId: string
  ) {
    const skip = (pageNum - 1) * pageSize;
    const initialTime = new Date("1899-01-01T00:00:00");
    const notiCheck = await this.notiCheckRepository.findByOwnerId(ownerId);
    const notiCheckedDate =
      notiCheck === null ? initialTime.toISOString() : notiCheck.checkedTime;

    return await this.notiRepository.getMyUncheckedNotis(
      skip,
      pageSize,
      ownerId,
      notiCheckedDate
    );
  }
}
