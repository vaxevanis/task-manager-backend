import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '@task-manager/prisma';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  const prismaMock = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new task', async () => {
    const dto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test description',
      status: undefined,
      priority: undefined,
      dueDate: undefined,
    };

    const userId = '1';

    const createdTask = {
      id: 1,
      title: dto.title,
      description: dto.description,
      status: 'OPEN',
      priority: 'MEDIUM',
      dueDate: null,
      createdById: userId,
      updatedById: userId,
    };

    prismaMock.task.create.mockResolvedValue(createdTask);

    const result = await service.create(dto, userId);

    expect(prismaMock.task.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        createdById: userId,
        updatedById: userId,
      },
    });
    expect(result).toEqual(createdTask);
  });
});
