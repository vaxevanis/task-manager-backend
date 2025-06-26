import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    //   Uncomment to Clear existing data 
    //   await prisma.task.deleteMany();
    //   await prisma.user.deleteMany();

    // Seed users
    const password = await bcrypt.hash('password123', 10);

    const users = await prisma.user.createMany({
        data: [
            {
                email: 'user1@example.com',
                name: 'John Doe',
                hashedPassword: password,
                role: 'USER',
            },
            {
                email: 'admin@example.com',
                name: 'Admin User',
                hashedPassword: password,
                role: 'ADMIN',
            },
            {
                email: 'superadmin@example.com',
                name: 'Super Admin',
                hashedPassword: password,
                role: 'SUPERADMIN',
            },
        ],
        skipDuplicates: true,
    });

    console.log(`Created ${users.count} users`);

    // Get user IDs for task assignment
    const allUsers = await prisma.user.findMany();

    // Seed tasks
    const tasks = await prisma.task.createMany({
        data: [
            {
                title: 'Complete project documentation',
                description: 'Write API documentation',
                status: 'TODO',
                priority: 'HIGH',
                createdById: allUsers[0].id,
                updatedById: allUsers[0].id,
            },
            {
                title: 'Fix authentication bug',
                description: 'Users cannot login on mobile',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                createdById: allUsers[1].id,
                updatedById: allUsers[1].id,
            },
            {
                title: 'Setup CI/CD pipeline',
                status: 'DONE',
                priority: 'MEDIUM',
                createdById: allUsers[2].id,
                updatedById: allUsers[2].id,
            },
            {
                title: 'Write unit tests',
                description: 'Coverage should be at least 80%',
                status: 'TODO',
                priority: 'LOW',
                createdById: allUsers[0].id,
                updatedById: allUsers[0].id,
            },
        ],
        skipDuplicates: true,
    });

    console.log(`Created ${tasks.count} tasks`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });