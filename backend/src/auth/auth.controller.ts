import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from '../user/dto/signin.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
      maxAge: 3600000, // 1 hour
      sameSite: 'none',
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.BASE_DOMAIN
          : undefined,
    });

    return res.status(HttpStatus.OK).send({ message: 'Sign in successful' });
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res() res: Response) {
    this.logger.log('Logout attempt');
    // Clear the JWT cookie by setting it to an empty string and setting maxAge to 0
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 0,
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.BASE_DOMAIN
          : undefined,
    });

    this.logger.log('Logged out successfully');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
