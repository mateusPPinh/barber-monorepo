import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Appointment } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async getBarberAppointments(barberId: number): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: {
        userId: barberId,
        user: {
          role: 'ADMIN',
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async createAppointment(userId: number, date: Date): Promise<Appointment> {
    return this.prisma.appointment.create({
      data: {
        date,
        userId,
      },
    });
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      orderBy: {
        date: 'asc',
      },
    });
  }
}
