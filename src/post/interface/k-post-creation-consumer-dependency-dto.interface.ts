import { NotiService } from "src/noti/noti.service";
import { PostRepostory } from "../post.repository";

export interface IKPostCreationConsumerDependency {
  postRepository: PostRepostory;
  notiService: NotiService;
}
