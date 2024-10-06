import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(email: string, name: string, password: string): Promise<User> {
    const user = new this.userModel({ email, name, password });
    return user.save();
  }
}
