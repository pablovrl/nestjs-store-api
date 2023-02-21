import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import * as argon2 from 'argon2';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: PrismaService;

  const createUserData = {
    email: 'test@test.com',
    password: 'admin',
    name: 'John Doe',
  };

  const user: User = {
    id: 1,
    name: 'John Doe',
    email: 'pablo@gmail.com',
    password: 'this is a hash',
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'USER',
  };

  const db = {
    user: {
      create: jest.fn().mockResolvedValue(user),
      findUnique: jest.fn().mockResolvedValue(user),
    },
  };

  const config = {
    get: jest.fn().mockReturnValue('secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: db,
        },
        {
          provide: ConfigService,
          useValue: config,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should return a token if user is created', async () => {
      const userSignup = await authService.signup(createUserData);

      expect(userSignup).toHaveProperty('access_token');
    });

    it('should throw an error if the email is already taken', () => {
      const spy = jest.spyOn(prisma.user, 'create').mockRejectedValue({
        code: 'P2002',
      });

      const userSignup = authService.signup(createUserData);

      expect(spy).toBeCalledTimes(1);
      expect(userSignup).rejects.toThrowError();
    });
  });

  describe('signin', () => {
    it('should return a token if the credentials are valid', async () => {
      const spy = jest.spyOn(argon2, 'verify').mockResolvedValueOnce(true);

      const userSignin = await authService.signin({
        email: createUserData.email,
        password: createUserData.password,
      });

      expect(spy).toBeCalledTimes(1);
      expect(userSignin).toHaveProperty('access_token');
    });

    it('should throw an error if the email is invalid', () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      const userSignin = authService.signin({
        email: createUserData.email,
        password: createUserData.password,
      });

      expect(userSignin).rejects.toThrowError();
    });

    it('should throw an error if the password is invalid', () => {
      jest.spyOn(argon2, 'verify').mockResolvedValueOnce(false);

      const userSignin = authService.signin({
        email: createUserData.email,
        password: createUserData.password,
      });

      expect(userSignin).rejects.toThrowError();
    });
  });

  describe('signToken', () => {
    it('should return a token', () => {
      const token = authService.signToken(user.id, user.email);

      expect(token).toHaveProperty('access_token');
    });
  });
});
