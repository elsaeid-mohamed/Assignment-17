import { UserRepository } from "../../DB/repo/user.repository";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../commen/response";
import { compareHash, generateHash } from "../commen/utils/hash";
import { ILogin, ISignUp } from "./dto/auth.dto";

class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async login(data: ILogin) {
    const { email, password } = data;

    const user = await this.userRepo.findOne({ filter: { email } });

    if (!user) {
      throw new NotFoundException("user not found");
    }

    const isMatch = await compareHash(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("invalid email or password");
    }

    return { user };
  }

  async signUp(data: ISignUp) {
    const { email, password, confirmPassword, ...userData } = data;

    const existUser = await this.userRepo.findOne({ filter: { email } });

    if (existUser) {
      throw new ConflictException("email already exists");
    }

    const user = await this.userRepo.createOne({
      data: { email, password: await generateHash(password), ...userData },
    });

    return { user };
  }
}

const authService = new AuthService();

export default authService;