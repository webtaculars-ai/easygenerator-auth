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
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 200,
    description: 'User registered and logged in successfully',
  })
  @ApiResponse({ status: 409, description: 'Email is already registered' })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    this.logger.log(`Sign up request received for email: ${signUpDto.email}`);
    try {
      const { email, name, password } = signUpDto;
      const user = await this.userService.signUp(email, name, password);

      const jwt = await this.authService.login(user);
      this.logger.log(`User signed up and logged in successfully: ${email}`);

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
      this.logger.error(
        `Error during sign up for email: ${signUpDto.email}`,
        error.stack,
      );
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
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Profile request received');
    const user = req.headers;
    if (!user) {
      this.logger.warn('Unauthorized profile access attempt');
      return res.status(401).json({ message: 'Unauthorized user' });
    }
    this.logger.log('Profile successfully retrieved');
    return res.status(200).json({ user });
  }
}
