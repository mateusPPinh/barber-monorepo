import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Patch,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from '../dto/create-user.dto';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { diskStorage } from 'multer';
import * as path from 'path';
import { UpdateUserDto } from 'src/dto/update-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findByEmail(updateUserDto.email);

    if (user && user.id !== +id) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'User with this e-mail already exists.',
        },
        HttpStatus.CONFLICT,
      );
    }

    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Patch(':id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = file.path.split('uploads')[1];
    return this.usersService.updatePhoto(+id, photoPath);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
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
