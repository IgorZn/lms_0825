import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { courseId: string; attachmentId: string } }) {
  try {
    const { userId } = await auth();
    const { courseId, attachmentId } = params;
    const courseOwner = await prisma.course.findUnique({ where: { id: courseId, userId: userId as string } });

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!courseOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attachment = await prisma.attachment.delete({ where: { id: attachmentId } });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[COURSE ATTACHMENT DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
