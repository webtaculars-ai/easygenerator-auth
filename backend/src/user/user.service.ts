import {
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async signUp(email: string, name: string, password: string): Promise<User> {
    try {
      const user = new this.userModel({ email, name, password });
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }
}
