import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  ConflictException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

      return res.status(HttpStatus.OK).send({
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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const user = req.headers;
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }
    return res.status(200).json({ user });
  }
}
