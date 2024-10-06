import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { ConflictException, HttpStatus } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService;

  const mockUserService = {
    signUp: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn(),
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up the user and return JWT token', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        name: 'John',
        password: 'P@ssword123',
      };
      const mockUser = {
        _id: '1',
        email: signUpDto.email,
        name: signUpDto.name,
      };

      mockUserService.signUp.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue({ accessToken: 'jwt-token' });

      await userController.signUp(signUpDto, mockRes);

      expect(userService.signUp).toHaveBeenCalledWith(
        signUpDto.email,
        signUpDto.name,
        signUpDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'jwt',
        'jwt-token',
        expect.any(Object),
      );
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: 'User registered and logged in successfully',
      });
    });

    it('should handle ConflictException for duplicate email', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        name: 'John',
        password: 'P@ssword123',
      };
      mockUserService.signUp.mockRejectedValue(
        new ConflictException('Email is already registered'),
      );

      await userController.signUp(signUpDto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email is already registered',
      });
    });
  });
});
