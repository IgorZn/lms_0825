import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Chapter } from '@prisma/client';

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  const { userId } = await auth();
  const { list } = await req.json();
  const courseOwner = await prisma.course.findUnique({ where: { id: courseId, userId: userId as string } });

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!courseOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!courseId) {
    return NextResponse.json({ error: 'No such course id' }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      list.map((ch: Chapter) =>
        prisma.chapter.update({
          where: { id: ch.id },
          data: { position: ch.position },
        }),
      ),
    );
    return NextResponse.json({ message: 'Chapters reordered successfully' }, { status: 200 });
  } catch (error) {
    console.log('[CHAPTER REORDER]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
