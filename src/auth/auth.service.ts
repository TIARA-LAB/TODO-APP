import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.sevice'
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/auth.dto';

export interface UserPayload {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPayload | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result as UserPayload;
    }
    return null;
  }

  async login(user: UserPayload) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto) {
    
    if (!dto || !dto.password || !dto.email) {
      throw new BadRequestException('Email and password are required');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role || 'USER',
      },
    });
    
    const { password, ...result } = user;
    return this.login(result as UserPayload);
  }
}