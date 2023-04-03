import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { AppointmentsModule } from './appointments/appointmens.module';
import { multerConfig } from './multer.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register(multerConfig),
    UsersModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
