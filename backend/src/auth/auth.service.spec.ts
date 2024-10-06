import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    validateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user and return the user object', async () => {
      const mockUser = { email: 'test@example.com', _id: 'userId' };
      mockUserService.validateUser.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );
      expect(userService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null if the user is not valid', async () => {
      mockUserService.validateUser.mockResolvedValue(null);

      const result = await authService.validateUser(
        'test@example.com',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a JWT token', async () => {
      const mockUser = { email: 'test@example.com', _id: 'userId' };
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await authService.login(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'userId',
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });
  });
});
