import { Session } from "express-session";
import { IOAuthUser } from "@src/oauth/interface/oauth-user.interface";

export interface IAuthSession extends Session {
  user: IOAuthUser;
  data: Record<string, string | Record<string, string>>;
}
