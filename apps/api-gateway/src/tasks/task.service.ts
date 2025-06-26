import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, taskWithUsers } from '@task-manager/prisma';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        ...dto,
        createdById: userId,
        updatedById: userId,
      },
    });
  }

  async findAll(query: QueryTaskDto) {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;
    const where = {
      ...(status && { status }),
      ...(priority && { priority }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
        include: taskWithUsers
        ,
      }),
      this.prisma.task.count({ where }),
    ]);

    return { total, page, limit, items };
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id }, include: {
        createdBy: true,
        updatedBy: true,
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto, userId: string) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        updatedById: userId,
      },
      include: taskWithUsers,

    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.task.delete({ where: { id } });
  }
}
