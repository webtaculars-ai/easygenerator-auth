import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name); // Initialize logger

  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`Validating user during sign in: ${email}`);
    return this.userService.validateUser(email, password);
  }

  async login(user: any) {
    const payload: JwtPayload = { email: user.email, sub: user._id };
    this.logger.log(`Generating JWT for user: ${user.email}`);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
