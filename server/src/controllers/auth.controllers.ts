import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import express from 'express';

import { AuthServiceImplemantation } from '../application/auth/auth.service';
import { LogindDto } from '../application/auth/dto/LogindDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServiceImplemantation) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() user: LogindDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken } = await this.authService.login(user);

    res.cookie('engnet_auth', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() user: LogindDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken } = await this.authService.register(user);

    res.cookie('engnet_auth', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { success: true };
  }
}
