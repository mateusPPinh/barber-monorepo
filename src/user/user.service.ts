import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { User } from '@prisma/client';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from 'src/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const role = createUserDto.role || 'USER';
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        role,
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { name, email, password, oldPassword } = updateUserDto;
    const updatedUserData: any = {};

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (name) {
      updatedUserData.name = name;
    }
    if (email) {
      updatedUserData.email = email;
    }
    if (password) {
      if (!oldPassword) {
        throw new BadRequestException('Old password is required');
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      const hashedPassword = await this.hashPassword(password);
      updatedUserData.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data: updatedUserData,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async updatePhoto(id: number, photoPath: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { photo: photoPath },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async generateJwtToken(email: string): Promise<string> {
    const payload: JwtPayload = { email };
    return this.jwtService.sign(payload);
  }
}
