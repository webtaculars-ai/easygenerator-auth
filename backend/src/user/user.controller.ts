import {
  Controller,
  Post,
  Body,
  Res,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    try {
      const { email, name, password } = signUpDto;
      const user = await this.userService.signUp(email, name, password);

      const jwt = await this.authService.login(user);

      res.cookie('jwt', jwt.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });

      return res.send({
        message: 'User registered and logged in successfully',
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong, please try again',
      });
    }
  }
}
