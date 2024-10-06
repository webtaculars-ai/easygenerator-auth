import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from '../user/dto/signin.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    this.logger.log(`Sign in attempt for email: ${signInDto.email}`);
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password,
    );

    if (!user) {
      this.logger.warn(`Invalid credentials for email: ${signInDto.email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwt = await this.authService.login(user);
    this.logger.log(`User signed in successfully: ${signInDto.email}`);

    res.cookie('jwt', jwt.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    return res.status(HttpStatus.OK).send({ message: 'Sign in successful' });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    this.logger.log('Logout attempt');
    // Clear the JWT cookie by setting it to an empty string and setting maxAge to 0
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
    });

    this.logger.log('Logged out successfully');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
