import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    // Check if organization with same name exists
    const existingOrg = await this.prisma.organization.findFirst({
      where: { name: createOrganizationDto.name },
    });

    if (existingOrg) {
      throw new ConflictException('Organization with this name already exists');
    }

    return this.prisma.organization.create({
      data: {
        name: createOrganizationDto.name,
        description: createOrganizationDto.description,
        verified: createOrganizationDto.verified || false,
      },
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        events: {
          select: {
            id: true,
            title: true,
            startAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        events: {
          select: {
            id: true,
            title: true,
            description: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    await this.findOne(id); // Check if organization exists

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if organization exists

    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async verifyOrganization(id: string) {
    await this.findOne(id); // Check if organization exists

    return this.prisma.organization.update({
      where: { id },
      data: { verified: true },
    });
  }
}
