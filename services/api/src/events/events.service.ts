import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    // Check if organization exists
    const organization = await this.prisma.organization.findUnique({
      where: { id: createEventDto.orgId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.prisma.event.create({
      data: {
        orgId: createEventDto.orgId,
        title: createEventDto.title,
        description: createEventDto.description,
        sdgGoal: createEventDto.sdgGoal,
        startAt: new Date(createEventDto.startAt),
        endAt: createEventDto.endAt ? new Date(createEventDto.endAt) : null,
        location: createEventDto.location,
        capacity: createEventDto.capacity,
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        registrations: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            status: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
      include: {
        org: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        registrations: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            status: true,
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            verified: true,
            description: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id); // Check if event exists

    const data: any = { ...updateEventDto };

    // Convert date strings to Date objects if provided
    if (updateEventDto.startAt) {
      data.startAt = new Date(updateEventDto.startAt);
    }
    if (updateEventDto.endAt) {
      data.endAt = new Date(updateEventDto.endAt);
    }

    return this.prisma.event.update({
      where: { id },
      data,
      include: {
        org: {
          select: {
            id: true,
            name: true,
          },
        },
        registrations: {
          select: {
            id: true,
            user: {
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

  async remove(id: string) {
    await this.findOne(id); // Check if event exists

    return this.prisma.event.delete({
      where: { id },
    });
  }

  async findByOrganization(orgId: string) {
    return this.prisma.event.findMany({
      where: { orgId },
      include: {
        registrations: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            status: true,
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  async getUpcomingEvents() {
    return this.prisma.event.findMany({
      where: {
        startAt: {
          gte: new Date(),
        },
      },
      include: {
        org: {
          select: {
            id: true,
            name: true,
            verified: true,
          },
        },
        registrations: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
      take: 10,
    });
  }
}
