import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { Wall, User } from '../../../../lib/sequelize';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const wall = await Wall.findOne({
      where: { slug },
      include: [{
        model: User,
        attributes: ['name', 'avatarUrl']
      }]
    });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found' }, { status: 404 });
    }

    // Always resolve session to determine creator status
    const session = await getSessionUser();
    const isCreator = !!(session && session.userId === wall.getDataValue('creatorId'));

    return NextResponse.json({ wall, isCreator });
  } catch (error) {
    console.error('GET wall error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();

    const wall = await Wall.findOne({ where: { slug, creatorId: session.userId } });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found or unauthorized' }, { status: 404 });
    }

    await wall.update({
      title: body.title !== undefined ? body.title : wall.getDataValue('title'),
      description: body.description !== undefined ? body.description : wall.getDataValue('description'),
      privacy: body.privacy !== undefined ? body.privacy : wall.getDataValue('privacy'),
      allowAnonymous: body.allowAnonymous !== undefined ? body.allowAnonymous : wall.getDataValue('allowAnonymous'),
    });

    return NextResponse.json({ wall });
  } catch (error) {
    console.error('PATCH wall error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const wall = await Wall.findOne({ where: { slug, creatorId: session.userId } });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found or unauthorized' }, { status: 404 });
    }

    await wall.destroy();

    return NextResponse.json({ message: 'Wall deleted successfully' });
  } catch (error) {
    console.error('DELETE wall error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
