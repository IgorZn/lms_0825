import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    const { courseId }: { courseId: string } = params;
    const values = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!courseId) {
      return NextResponse.json({ error: 'No such course id' }, { status: 400 });
    }

    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSE UPDATE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
