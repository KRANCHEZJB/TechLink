import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: createRegistrationDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: createRegistrationDto.eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user is already registered for this event
    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: createRegistrationDto.userId,
          eventId: createRegistrationDto.eventId,
        },
      },
    });

    if (existingRegistration) {
      throw new ConflictException('User is already registered for this event');
    }

    // Check event capacity
    if (event.capacity) {
      const currentRegistrations = await this.prisma.registration.count({
        where: { eventId: createRegistrationDto.eventId },
      });

      if (currentRegistrations >= event.capacity) {
        throw new BadRequestException('Event is at full capacity');
      }
    }

    return this.prisma.registration.create({
      data: {
        userId: createRegistrationDto.userId,
        eventId: createRegistrationDto.eventId,
        status: createRegistrationDto.status || 'registered',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            org: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.registration.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            org: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            startAt: true,
            endAt: true,
            org: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return registration;
  }

  async update(id: string, updateRegistrationDto: UpdateRegistrationDto) {
    await this.findOne(id); // Check if registration exists

    return this.prisma.registration.update({
      where: { id },
      data: updateRegistrationDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if registration exists

    return this.prisma.registration.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            org: {
              select: {
                id: true,
                name: true,
                verified: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByEvent(eventId: string) {
    return this.prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: string, status: string) {
    await this.findOne(id); // Check if registration exists

    return this.prisma.registration.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
}
