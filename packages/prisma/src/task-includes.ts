import { Prisma } from '@prisma/client';

export const taskWithUsers = Prisma.validator<Prisma.TaskInclude>()({
    createdBy: {
        select: {
            id: true,
            name: true,
            email: true,
            // other safe fields
        }
    },
    updatedBy: {
        select: {
            id: true,
            name: true,
            email: true,
            // other safe fields
        }
    }
});

export type TaskWithUsers = Prisma.TaskGetPayload<{
    include: typeof taskWithUsers;
}>;