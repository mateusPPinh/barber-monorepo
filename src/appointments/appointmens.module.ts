// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [AppointmentsService, PrismaService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
