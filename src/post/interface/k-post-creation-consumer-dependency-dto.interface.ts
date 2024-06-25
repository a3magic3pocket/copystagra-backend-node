import { NotiService } from "@src/noti/noti.service";
import { PostRepository } from "../post.repository";

export interface IKPostCreationConsumerDependency {
  postRepository: PostRepository;
  notiService: NotiService;
}
