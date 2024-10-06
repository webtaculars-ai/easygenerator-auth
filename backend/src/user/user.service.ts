import {
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async signUp(email: string, name: string, password: string): Promise<User> {
    try {
      this.logger.log(`Creating new user in the database with email: ${email}`);
      const user = new this.userModel({ email, name, password });
      await user.save();
      return user;
    } catch (error) {
      this.logger.error(
        `Error during user creation for email: ${email}`,
        error.stack,
      );
      if (error.code === 11000) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    this.logger.log(`Looking for user in the database with email: ${email}`);
    const user = await this.userModel.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      this.logger.log(`User found and password validated for email: ${email}`);
      return user;
    }
    this.logger.warn(`Invalid credentials for email: ${email}`);
    return null;
  }
}
