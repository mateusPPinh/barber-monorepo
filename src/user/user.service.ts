import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async generateJwtToken(email: string): Promise<string> {
    const payload: JwtPayload = { email };
    return this.jwtService.sign(payload);
  }
}
