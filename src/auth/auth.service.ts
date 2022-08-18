import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

export class Error {
  constructor(readonly code: number, readonly message: string) {}
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<{ access_token: string } | Error> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return new Error(403, 'Credentials taken');
        }
      }
    }
  }

  async signin(dto: AuthDto): Promise<{ access_token: string } | Error> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });

      if (!user) return new Error(403, 'Credentials Incorrect');

      const isCorrectPassword = await argon.verify(user.hash, dto.password);

      if (!isCorrectPassword) return new Error(403, 'Credential Incorrect');

      return this.signToken(user.id, user.email);
    } catch (error) {
      return new Error(500, 'internal server error');
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET_KEY');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret,
    });

    return {
      access_token: token,
    };
  }
}
