import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with this e-mail already exists.',
        },
        HttpStatus.CONFLICT,
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: { email: string; password: string }) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Invalid e-mail or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const jwtToken = await this.usersService.generateJwtToken(email);
    const { password: _, ...userWithoutPassword } = user as any;
    return { access_token: jwtToken, user: userWithoutPassword };
  }
}
