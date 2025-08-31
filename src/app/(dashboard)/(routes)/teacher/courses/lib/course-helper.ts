import { prisma } from '@/lib/db';

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: {
      id,
    },
  });
}
