import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;
  const authHeader = req.headers.get('Authorization');

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const postId = (body as { postId?: unknown }).postId;
  if (typeof postId !== 'number' || !Number.isInteger(postId) || postId < 1) {
    return NextResponse.json({ error: 'postId must be a positive integer' }, { status: 400 });
  }

  revalidatePath(`/[lang]/posts/${postId}`, 'page');
  revalidatePath('/[lang]/posts', 'page');

  return NextResponse.json({ revalidated: true, postId });
}
