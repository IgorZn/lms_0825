import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  const { courseId, chapterId } = params;
  const { userId } = await auth();
  const { isPublished, ...values } = await req.json();

  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!courseId) return NextResponse.json({ error: 'No such course id' }, { status: 400 });

  try {
    const chapter = await prisma.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    // TODO: handle video upload
    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTER UPDATE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
