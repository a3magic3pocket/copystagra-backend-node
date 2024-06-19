export class NotiRetrDto {
  notiId: string;
  ownerName: string;
  ownerThumbImagePath: string;
  content: string;
  relatedPostId: string;
  postThumbImagePath: string;
  createdAt: number[];

  constructor(
    notiId: string,
    ownerName: string,
    ownerThumbImagePath: string,
    content: string,
    relatedPostId: string,
    postThumbImagePath: string,
    createdAt: number[]
  ) {
    this.notiId = notiId;
    this.ownerName = ownerName;
    this.ownerThumbImagePath = ownerThumbImagePath;
    this.content = content;
    this.relatedPostId = relatedPostId;
    this.postThumbImagePath = postThumbImagePath;
    this.createdAt = createdAt;
  }
}

export const NOTI_RETR_DTO_FIELDS = {
  notiId: "notiId",
  ownerName: "ownerName",
  ownerThumbImagePath: "ownerThumbImagePath",
  content: "content",
  relatedPostId: "relatedPostId",
  postThumbImagePath: "postThumbImagePath",
  createdAt: "createdAt",
};
