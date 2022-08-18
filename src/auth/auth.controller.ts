import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

import { AuthService, Error } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async singup(@Body() dto: AuthDto) {
    const result = await this.authService.signup(dto);
    if (result instanceof Error) {
      if (result.code === 403) throw new ForbiddenException(result.message);
      throw new InternalServerErrorException();
    }
    return result;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto) {
    const result = await this.authService.signin(dto);
    if (result instanceof Error) {
      if (result.code === 403) throw new ForbiddenException(result.message);
      throw new InternalServerErrorException();
    }
    return result;
  }
}
