import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from '../user/dto/signin.dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return status 200 and sign in the user', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUser = { email: 'test@example.com', _id: 'userId' };
      const jwt = { accessToken: 'jwt-token' };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(jwt);

      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await authController.signIn(signInDto, res);

      expect(authService.validateUser).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        'jwt-token',
        expect.anything(),
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith({ message: 'Sign in successful' });
    });

    it('should return 401 if invalid credentials', async () => {
      const signInDto: SignInDto = {
        email: 'wrong@example.com',
        password: 'wrong-password',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.signIn(signInDto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('logout', () => {
    it('should clear cookie and return 200', async () => {
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authController.logout(res);

      expect(res.cookie).toHaveBeenCalledWith('jwt', '', expect.anything());
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
