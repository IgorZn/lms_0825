import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    const { courseId } = params;
    const { url } = await request.json();
    const courseOwner = await prisma.course.findUnique({ where: { id: courseId, userId: userId as string } });

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!courseOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attachment = await prisma.attachment.create({
      data: {
        courseId,
        url: url as string,
        name: url.split('/').pop() as string,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[COURSE UPDATE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
