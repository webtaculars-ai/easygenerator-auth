import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { User } from './schema/user.schema';
import { AuthService } from '../auth/auth.service';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: any;

  const mockUserInstance = {
    email: 'test@example.com',
    name: 'John',
    password: 'P@ssword123',
  };

  const saveMock = jest.fn();

  beforeEach(async () => {
    mockUserModel = jest.fn().mockImplementation(() => ({
      ...mockUserInstance,
      save: saveMock,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'John',
        password: 'P@ssword123',
      };

      saveMock.mockResolvedValue(mockUser);

      const result = await service.signUp(
        'test@example.com',
        'John',
        'P@ssword123',
      );

      expect(mockUserModel).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'John',
        password: 'P@ssword123',
      });
      expect(saveMock).toHaveBeenCalled();
      expect(result).toMatchObject(mockUser);
    });

    it('should throw ConflictException if email is already registered', async () => {
      saveMock.mockRejectedValue({ code: 11000 });

      await expect(
        service.signUp('test@example.com', 'John', 'P@ssword123'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return the user when valid credentials are provided', async () => {
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      mockUserModel.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'P@ssword123',
      );
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when invalid credentials are provided', async () => {
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      mockUserModel.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrong-password',
      );
      expect(result).toBeNull();
    });
  });
});
