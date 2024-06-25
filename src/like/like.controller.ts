import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Session,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  LIKE_FORM_DATA_DTO_FIELDS,
  LikeFormDataDto,
} from "./dto/like-form-data.dto";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { PostRepository } from "@src/post/post.repository";
import { IErrorRespDto } from "@src/global/dto/interface/error-resp-dto.interface";
import { LoginGuard } from "@src/login/login.guard";
import { IAuthSession } from "@src/login/interface/auth-session.interface";
import { ILikeUpsertDto } from "./interface/like-upsert-dto.interface";
import { LikeService } from "./like.service";
import { ISimpleSuccessRespDto } from "@src/global/dto/interface/simple-success-resp-dto.interface";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("like")
@Controller()
export class LikeController {
  constructor(
    private postRepository: PostRepository,
    private likeService: LikeService
  ) {}
  async isPostIdValid(postId: string) {
    return await this.postRepository.existsById(postId);
  }

  getInvalidPostIdError = (fieldName: string) => {
    const errorRespDto: IErrorRespDto = {
      code: "9999",
      locale: "ko",
      message: `${fieldName}은 유효하지 않은 postId 입니다`,
    };
    return errorRespDto;
  };

  async checkLikeFormData(likeFormData: LikeFormDataDto) {
    const isPostIdValid = await this.isPostIdValid(likeFormData.postId);
    if (!isPostIdValid) {
      const errorRespDto = this.getInvalidPostIdError(
        LIKE_FORM_DATA_DTO_FIELDS.postId
      );
      throw new UnprocessableEntityException(errorRespDto);
    }

    const isHookPostIdValid = await this.isPostIdValid(likeFormData.hookPostId);
    if (!isHookPostIdValid) {
      const errorRespDto = this.getInvalidPostIdError(
        LIKE_FORM_DATA_DTO_FIELDS.hookPostId
      );
      throw new UnprocessableEntityException(errorRespDto);
    }

    return true;
  }

  @Post("/v1/like/up")
  @ApiOperation({ summary: "좋아요" })
  @ApiBody({ description: "body", type: LikeFormDataDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "갱신 성공",
  })
  @UseGuards(LoginGuard)
  @UseInterceptors(NoFilesInterceptor())
  async up(
    @Session() session: IAuthSession,
    @Body() likeFormData: LikeFormDataDto
  ) {
    const isPostIdValid = this.isPostIdValid(likeFormData.postId);
    if (!isPostIdValid) {
      const errorRespDto = this.getInvalidPostIdError(
        LIKE_FORM_DATA_DTO_FIELDS.postId
      );
      throw new UnprocessableEntityException(errorRespDto);
    }

    const isHookPostIdValid = this.isPostIdValid(likeFormData.hookPostId);
    if (!isHookPostIdValid) {
      const errorRespDto = this.getInvalidPostIdError(
        LIKE_FORM_DATA_DTO_FIELDS.hookPostId
      );
      throw new UnprocessableEntityException(errorRespDto);
    }

    const likeUpsertDto: ILikeUpsertDto = {
      postId: likeFormData.postId,
      ownerId: session.user.sub,
    };

    await this.likeService.up(likeUpsertDto);

    const result: ISimpleSuccessRespDto = {
      message: "success",
    };

    return result;
  }

  @Post("/v1/like/down")
  @ApiOperation({ summary: "좋아요 취소" })
  @ApiBody({ description: "body", type: LikeFormDataDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "갱신 성공",
  })
  @UseGuards(LoginGuard)
  @UseInterceptors(NoFilesInterceptor())
  async down(
    @Session() session: IAuthSession,
    @Body() likeFormData: LikeFormDataDto
  ) {
    const likeUpsertDto: ILikeUpsertDto = {
      postId: likeFormData.postId,
      ownerId: session.user.sub,
    };

    await this.likeService.down(likeUpsertDto);

    const result: ISimpleSuccessRespDto = {
      message: "success",
    };

    return result;
  }
}
