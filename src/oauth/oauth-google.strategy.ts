import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserRepository } from "@src/user/user.repository";
import { IUserCreateDto } from "@src/user/interface/user-create-dto.interface";
import { USER_ROLE } from "@src/user/user-role";
import { IOAuthUser } from "@src/oauth/interface/oauth-user.interface";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private userRepository: UserRepository) {
    super({
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      scope:
        process.env.GOOGLE_AUTH_SCOPE &&
        process.env.GOOGLE_AUTH_SCOPE.split(","),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails[0].value;
    const name = email.split("@")[0];
    let user = await this.userRepository.findByEmail(email);
    if (user === null) {
      const defaultLocale = "ko";
      const defaultDescription = "Hello copystagram :)";
      const locale = profile._json.hd ? profile._json.hd : defaultLocale;

      const newUser: IUserCreateDto = {
        email: email,
        openId: profile.id,
        name: name,
        provider: profile.provider,
        role: USER_ROLE.NORMAL,
        isActive: true,
        locale: locale,
        description: defaultDescription,
        userImagePath: null,
      };

      user = await this.userRepository.create(newUser);
    }

    const oAuthUser: IOAuthUser = {
      sub: user._id.toString(),
      openId: user.openId,
      email: user.email,
      isActive: user.isActive,
      name: user.name,
    };

    return oAuthUser;
  }
}
