import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getCourseById(id: string) {
  const { userId } = await auth();
  return prisma.course.findUnique({
    where: {
      id,
      userId: userId as string,
    },
    include: {
      chapters: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      attachments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}
