import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Mux from '@mux/mux-node';

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

    // Handle video upload
    const client = new Mux({
      tokenId: process.env['MUX_TOKEN_ID'], // This is the default and can be omitted
      tokenSecret: process.env['MUX_TOKEN_SECRET'], // This is the default and can be omitted
    });

    if (values.videoURL) {
      const existingAsset = await prisma.muxDate.findUnique({
        where: {
          chapterId,
        },
      });

      if (existingAsset) {
        await client.video.assets.delete(existingAsset.id);
        await prisma.muxDate.deleteMany({ where: { id: existingAsset.id } });
      }

      const params: Mux.Video.AssetCreateParams = {
        inputs: [{ url: values.videoURL }],
        playback_policies: ['public'],
      };

      const asset: Mux.Video.Asset = await client.video.assets.create(params);
      const playbackId = asset.playback_ids[0].id ?? '';

      // create muxDate
      await prisma.muxDate.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: playbackId,
        },
      });

      console.log('mux__asset>>', asset);
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[CHAPTER UPDATE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
