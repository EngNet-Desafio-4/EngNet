import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LogindDto } from './dto/LogindDto';
import { LoginResponse } from './response/LoginResponse';

@Injectable()
export class AuthServiceImplemantation {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  private async generateHash(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  private async verifyHash(
    userPassword: string,
    dbPassword: string,
  ): Promise<void> {
    const isPasswordValid = await argon2.verify(dbPassword, userPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('O email ou senha estão incorretos');
    }
  }

  async login(login: LogindDto): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: login.email },
    });

    if (!user) {
      throw new UnauthorizedException('O email ou senha estão incorretos');
    }

    await this.verifyHash(login.password, user.password);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  async register(login: LogindDto): Promise<LoginResponse> {
    const hash = await this.generateHash(login.password);

    const user = this.userRepository.create({
      email: login.email,
      password: hash,
    });

    await this.userRepository.save(user);

    return {
      accessToken: await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}
