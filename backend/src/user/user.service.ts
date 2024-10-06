import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signUp(email: string, name: string, password: string): Promise<User> {
    const user = new this.userModel({ email, name, password });
    return user.save();
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return false;
    }
    return user.comparePassword(password);
  }
}
