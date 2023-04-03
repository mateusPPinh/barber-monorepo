import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from '@prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get('barber/:barberId')
  async getBarberAppointments(
    @Param('barberId') barberId: number,
  ): Promise<Appointment[]> {
    return this.appointmentsService.getBarberAppointments(barberId);
  }

  @Post()
  async createAppointment(
    @Body('userId') userId: number,
    @Body('date') date: Date,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointment(userId, date);
  }

  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentsService.getAllAppointments();
  }
}
