import { IOAuthUser } from "@src/oauth/interface/oauth-user.interface";

export interface IAuthUserRequest extends Request {
  user: IOAuthUser;
}
