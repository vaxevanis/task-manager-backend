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
            {
                email: 'user2@example.com',
                name: 'John Smith',
                hashedPassword: password,
                role: 'USER',
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
            }, {
                title: "Refactor user service",
                description: "Improve code readability and performance",
                status: "IN_PROGRESS",
                priority: "HIGH",
                createdById: allUsers[0].id,
                updatedById: allUsers[1].id,
            },
            {
                title: "Design dashboard UI",
                description: "Create mockups for the admin dashboard",
                status: "TODO",
                priority: "MEDIUM",
                createdById: allUsers[2].id,
                updatedById: allUsers[2].id,
            },
            {
                title: "Deploy to staging",
                description: "Run end-to-end tests after deployment",
                status: "DONE",
                priority: "HIGH",
                createdById: allUsers[1].id,
                updatedById: allUsers[0].id,
            },
            {
                title: "Update dependencies",
                description: "Security patches for React and Next.js",
                status: "TODO",
                priority: "MEDIUM",
                createdById: allUsers[3].id,
                updatedById: allUsers[3].id,
            },
            {
                title: "Implement dark mode",
                status: "IN_PROGRESS",
                priority: "LOW",
                createdById: allUsers[0].id,
                updatedById: allUsers[2].id,
            },
            {
                title: "Fix broken API endpoint",
                description: "/users/:id returns 500 error",
                status: "TODO",
                priority: "HIGH",
                createdById: allUsers[1].id,
                updatedById: allUsers[1].id,
            },
            {
                title: "Write integration tests",
                description: "Cover authentication flow",
                status: "TODO",
                priority: "MEDIUM",
                createdById: allUsers[3].id,
                updatedById: allUsers[3].id,
            },
            {
                title: "Optimize database queries",
                description: "Add indexes for frequently accessed fields",
                status: "IN_PROGRESS",
                priority: "HIGH",
                createdById: allUsers[2].id,
                updatedById: allUsers[0].id,
            },
            {
                title: "Prepare sprint retrospective",
                status: "TODO",
                priority: "LOW",
                createdById: allUsers[1].id,
                updatedById: allUsers[1].id,
            },
            {
                title: "Review pull requests",
                description: "5 PRs pending review",
                status: "DONE",
                priority: "MEDIUM",
                createdById: allUsers[0].id,
                updatedById: allUsers[3].id,
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