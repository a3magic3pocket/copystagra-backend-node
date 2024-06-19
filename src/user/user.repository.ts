import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { USER_COLLECTION_NAME, User, USER_FIELDS } from "./schema/user.schema";
import { Model } from "mongoose";
import { IUserCreateDto } from "./interface/user-create-dto.interface";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(USER_COLLECTION_NAME) private userModel: Model<User>
  ) {}

  async create(newUser: IUserCreateDto): Promise<User> {
    const createdUser = new this.userModel(newUser);
    return createdUser.save();
  }

  async findById(userId: string): Promise<User> {
    const condition = {
      [USER_FIELDS._id]: userId,
    };

    return this.userModel.findOne(condition);
  }

  async findByEmail(email: string): Promise<User> {
    const condition = {
      [USER_FIELDS.email]: email,
    };

    return this.userModel.findOne(condition);
  }

  async findByName(name: string): Promise<User> {
    const condition = {
      [USER_FIELDS.name]: name,
    };

    return this.userModel.findOne(condition);
  }
}
