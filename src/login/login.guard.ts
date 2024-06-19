import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IErrorRespDto } from "src/global/dto/interface/error-resp-dto.interface";

@Injectable()
export class LoginGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const session = req.session;

    if (session.user) {
      return true;
    }

    const errorRespDto: IErrorRespDto = {
      code: "9999",
      locale: "en",
      message: "authorization required",
    };

    throw new UnauthorizedException(errorRespDto);
  }
}
