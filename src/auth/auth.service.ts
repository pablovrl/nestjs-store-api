import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: SignUpDto) {
    const hashedPassword = await argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          cart: {
            create: {},
          },
        },
      });
      delete user.password;

      return user;
    } catch (e) {
      if (e.code === 'P2002')
        throw new ForbiddenException('Credenntials taken');
      throw e;
    }
  }

  async signin(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Invalid credentials');

    const passwordMatches = await argon2.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Invalid credentials');

    delete user.password;

    return user;
  }
}
