export class PostRespDto {
  postId: string;
  ownerName: string;
  description: string;
  thumbImagePath: string;
  numLikes: number;
  contentImagePaths: string[];
  createdAt: string;

  constructor(
    postId: string,
    ownerName: string,
    description: string,
    thumbImagePath: string,
    numLikes: number,
    contentImagePaths: string[],
    createdAt: string
  ) {
    this.postId = postId;
    this.ownerName = ownerName;
    this.description = description;
    this.thumbImagePath = thumbImagePath;
    this.numLikes = numLikes;
    this.contentImagePaths = contentImagePaths;
    this.createdAt = createdAt;
  }
}

export const POST_RESP_DTO_FIELDS = {
  postId: "postId",
  ownerName: "ownerName",
  description: "description",
  thumbImagePath: "thumbImagePath",
  numLikes: "numLikes",
  contentImagePaths: "contentImagePaths",
  createdAt: "createdAt",
};
