import { Module } from '@nestjs/common';
import { UsersController } from '../user/user.controller';
import { UsersService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.DATABASE_TOKEN_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
})
export class UsersModule {}
