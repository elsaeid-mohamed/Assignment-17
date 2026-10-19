import { BaseRepository } from "./base.repository";
import { IUser, UserModel } from "../models/user.model";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }
}