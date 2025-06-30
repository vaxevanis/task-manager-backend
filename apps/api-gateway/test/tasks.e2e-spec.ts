import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@task-manager/prisma';

describe('TasksController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        prisma = moduleRef.get(PrismaService);

        // Clean DB before tests start
        await prisma.task.deleteMany();
    });

    afterAll(async () => {
        // Clean DB after tests finish (optional)
        await prisma.task.deleteMany();

        await app.close();
    });

    it('/tasks (POST)', async () => {
        const dto = { title: 'Integration Task' };
        const response = await request(app.getHttpServer())
            .post('/tasks')
            .send(dto)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(dto.title);
    });

    it('/tasks/:id (GET)', async () => {
        // Create task with all required fields
        const created = await prisma.task.create({
            data: {
                title: 'Read Task',
                createdById: '1', // replace with valid user id if needed
                updatedById: '1',
                // set any required defaults manually if prisma schema requires
            },
        });

        const response = await request(app.getHttpServer())
            .get(`/tasks/${created.id}`)
            .expect(200);

        expect(response.body.id).toBe(created.id);
        expect(response.body.title).toBe('Read Task');
    });
});
