import { Inject, Injectable } from "@nestjs/common";
import { PostRepostory } from "./post.repository";
import { IPostCreateDto } from "./interface/post-create-dto.interface";
import { IKPostCreationDto } from "./interface/k-post-creation-dto.interface";
import { createDir, deleteDir, writeFile } from "src/global/file/file-util";
import { getKorTime } from "src/global/time/time-util";
import { CONSUMER_GROUP_ID, KAFKA_TOPIC } from "src/global/kafka/kafka-info";
import { KafkaConsumerService } from "src/global/kafka/kafka.consumer.service";
import { KafkaProducerService } from "src/global/kafka/kafka.producer.service";
import { IKConsumerMessage } from "src/global/kafka/interface/k-consumer-message.interface";
import * as sharp from "sharp";
import * as fs from "fs";
import { Post as PostSchema } from "./schema/post.schema";
import { getSha256Buffer } from "src/global/crypto/hash";
import { IKPostCreationConsumerDependency } from "./interface/k-post-creation-consumer-dependency-dto.interface";
import { Types } from "mongoose";
import { NotiService } from "src/noti/noti.service";
import { NOTI_CODE } from "src/noti/noti-info";

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepostory,
    private kafkaProducerService: KafkaProducerService,
    @Inject(CONSUMER_GROUP_ID.POST_CREATION)
    private kafkaConsumerService: KafkaConsumerService,
    private notiService: NotiService
  ) {
    const kafkaConsumerDependencies: IKPostCreationConsumerDependency = {
      postRepository: this.postRepository,
      notiService: this.notiService,
    };
    this.kafkaConsumerService.subscribe(
      KAFKA_TOPIC.POST_CREATION,
      this.consumePostCreation,
      kafkaConsumerDependencies
    );
  }

  async createPost(postCreateDto: IPostCreateDto) {
    this.producePostCreation(postCreateDto).catch((e) => {
      console.error(e);
    });
  }

  private async producePostCreation(postCreateDto: IPostCreateDto) {
    let imageDirName = crypto.randomUUID();
    const createdAt = getKorTime(new Date()).toISOString();

    this.saveRawImageFiles(imageDirName, postCreateDto);

    const kPostCreationDto: IKPostCreationDto = {
      description: postCreateDto.description,
      imageDirName: imageDirName,
      ownerId: postCreateDto.ownerId,
      createdAt: createdAt,
    };

    const key = imageDirName;
    this.kafkaProducerService.sendMessage(
      KAFKA_TOPIC.POST_CREATION,
      key,
      JSON.stringify(kPostCreationDto)
    );
  }

  private saveRawImageFiles(
    imageDirName: string,
    postCreateDto: IPostCreateDto
  ) {
    const imageRawDirPath = `${process.env.STATIC_DIR_PATH}/${process.env.IMAGE_DIR_NAME}/${imageDirName}/${process.env.IMAGE_RAW_DIR_NAME}`;
    createDir(imageRawDirPath);

    for (const [i, image] of postCreateDto.imageList.entries()) {
      const imageName = `${i}_${image.originalFilename}`;
      const imagePath = `${imageRawDirPath}/${imageName}`;

      writeFile(imagePath, image.imageBytes);
    }
  }

  private async consumePostCreation(
    message: IKConsumerMessage,
    dependencies: IKPostCreationConsumerDependency
  ) {
    console.log("receive message");
    const thumbImageLen = 144;
    const contentImageLen = 430;
    const imageExt = "jpeg";
    const kPostCreationDto: IKPostCreationDto = JSON.parse(
      message.value.toString()
    );
    const rootImageDirPath = `${process.env.STATIC_DIR_PATH}/${process.env.IMAGE_DIR_NAME}/${kPostCreationDto.imageDirName}`;
    const rawDirPath = `${rootImageDirPath}/${process.env.IMAGE_RAW_DIR_NAME}`;

    try {
      const thumbDirPath = `${rootImageDirPath}/${process.env.IMAGE_THUMB_DIR_NAME}`;
      const contentDirPath = `${rootImageDirPath}/${process.env.IMAGE_CONTENT_DIR_NAME}`;
      const contentImagePathsForDb = [];
      let thumbImagePathForDb = "";

      if (!fs.existsSync(rawDirPath)) {
        throw new Error(`${rawDirPath} not exists`);
      }

      createDir(thumbDirPath);
      createDir(contentDirPath);

      const fileNames = fs.readdirSync(rawDirPath);
      if (fileNames.length === 0) {
        return true;
      }

      for (const fileName of fileNames) {
        const imageNum = fileName.split("_")[0];
        const filePath = `${rawDirPath}/${fileName}`;

        const image = sharp(filePath);
        const metadata = await image.metadata();

        // 컨텐츠 이미지 정제 및 저장
        const isWidthLonger = metadata.width > metadata.height;
        const wantedLen = isWidthLonger ? metadata.height : metadata.width;
        let left = isWidthLonger
          ? Math.floor((metadata.width - wantedLen) / 2)
          : 0;
        let top = isWidthLonger
          ? 0
          : Math.floor((metadata.height - wantedLen) / 2);
        await image
          .extract({
            left,
            top,
            width: wantedLen,
            height: wantedLen,
          })
          .resize(contentImageLen, contentImageLen)
          .toFile(`${contentDirPath}/${imageNum}.${imageExt}`);

        const contentImagePathForDb = `/${kPostCreationDto.imageDirName}/${process.env.IMAGE_THUMB_DIR_NAME}/${imageNum}.${imageExt}`;
        contentImagePathsForDb.push(contentImagePathForDb);

        // 썸네일 이미지 정제 및 저장
        if (imageNum === "0") {
          await sharp(filePath)
            .extract({
              left,
              top,
              width: wantedLen,
              height: wantedLen,
            })
            .resize(thumbImageLen, thumbImageLen)
            .toFile(`${thumbDirPath}/${imageNum}.${imageExt}`);

          thumbImagePathForDb = `/${kPostCreationDto.imageDirName}/${process.env.IMAGE_CONTENT_DIR_NAME}/${imageNum}.${imageExt}`;
        }
      }
      sharp.cache(false);

      const source = Object.values(kPostCreationDto).join("|");
      const docHash = await getSha256Buffer(source);

      // DB 저장
      const newPost = new PostSchema(
        new Types.ObjectId(kPostCreationDto.ownerId),
        kPostCreationDto.description,
        kPostCreationDto.imageDirName,
        thumbImagePathForDb,
        contentImagePathsForDb,
        Buffer.from(docHash),
        kPostCreationDto.createdAt
      );

      const postRepository = dependencies.postRepository;
      const newPostResult: PostSchema =
        await postRepository.createPost(newPost);

      // 원본 이미지 디렉토리 삭제
      if (fs.existsSync(rawDirPath)) {
        await deleteDir(rawDirPath);
      }

      // 성공 알람 전송
      const notiService = dependencies.notiService;
      await notiService.createNoti(
        kPostCreationDto.ownerId,
        NOTI_CODE.POSTC_SUCCESS,
        newPostResult._id.toString()
      );

      return true;
    } catch (error) {
      console.error(error);

      // 원본 이미지 디렉토리 삭제
      if (fs.existsSync(rawDirPath)) {
        await deleteDir(rawDirPath);
      }

      // 실패 알람 전송
      const notiService = dependencies.notiService;
      notiService.createNoti(
        kPostCreationDto.ownerId,
        NOTI_CODE.POSTC_FAILURE,
        null
      );

      return true;
    }
  }

  async getRelatedAllPosts(
    pageNum: number,
    pageSize: number,
    hookPostId: string
  ) {
    const skip = (pageNum - 1) * pageSize;
    return await this.postRepository.getRelatedAllPosts(
      skip,
      pageSize,
      hookPostId
    );
  }

  async getLatestAllPosts(pageNum: number, pageSize: number) {
    const skip = (pageNum - 1) * pageSize;
    return await this.postRepository.getLatestAllPosts(skip, pageSize);
  }

  async getLatestPosts(pageNum: number, pageSize: number, ownerId: string) {
    const skip = (pageNum - 1) * pageSize;
    return await this.postRepository.getLatestPostsByUserId(
      skip,
      pageSize,
      ownerId
    );
  }

  async countPostsByUserId(ownerId: string) {
    return await this.postRepository.countPostsByUserId(ownerId);
  }
}
