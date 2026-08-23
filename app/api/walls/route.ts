import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/auth';
import { Wall, Note, User } from '../../../lib/sequelize';

// Simple slug generator
function generateSlug(title: string) {
  const base = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') || 'recent'; // 'recent' or 'alpha'

    // Fetch user's walls, including notes to derive counts and thumbnails
    const walls = await Wall.findAll({
      where: { creatorId: session.userId },
      include: [{ model: Note, attributes: ['color'] }],
      order: sort === 'alpha' ? [['title', 'ASC']] : [['createdAt', 'DESC']],
    });

    // Format response to match frontend requirements
    const formattedWalls = walls.map((wall: any) => {
      const plainWall = wall.get({ plain: true });
      return {
        id: plainWall.slug, // Map slug to id for frontend compatibility
        title: plainWall.title,
        type: plainWall.privacy,
        notesCount: plainWall.Notes ? plainWall.Notes.length : 0,
        lastActive: plainWall.updatedAt,
        // Grab up to the last 3 note colors for the mobile thumbnails
        thumbnails: plainWall.Notes 
          ? plainWall.Notes.slice(-3).map((n: any) => n.color) 
          : []
      };
    });

    return NextResponse.json({ walls: formattedWalls });
  } catch (error) {
    console.error('GET walls error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, privacy, allowAnonymous } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Enforce Pro plan limits
    if (privacy === 'PUBLIC') {
      const user = await User.findByPk(session.userId, { attributes: ['plan'] });
      const plan = user?.getDataValue('plan') || 'FREE';

      if (plan === 'FREE') {
        const publicWallCount = await Wall.count({
          where: { creatorId: session.userId, privacy: 'PUBLIC' }
        });
        if (publicWallCount >= 3) {
          return NextResponse.json({ 
            error: 'Free plan is limited to 3 public walls. Please upgrade to Pro to create more.' 
          }, { status: 403 });
        }
      }
    }

    const newWall = await Wall.create({
      slug: generateSlug(title),
      title,
      description: description || '',
      privacy: privacy || 'PUBLIC',
      allowAnonymous: allowAnonymous !== undefined ? allowAnonymous : true,
      creatorId: session.userId,
    });

    return NextResponse.json({ wall: newWall }, { status: 201 });
  } catch (error) {
    console.error('POST walls error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
