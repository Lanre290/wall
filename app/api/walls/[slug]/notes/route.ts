import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../../lib/auth';
import { Wall, Note, Appreciation, User } from '../../../../../lib/sequelize';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wall = await Wall.findOne({ where: { slug } });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found' }, { status: 404 });
    }

    // If PRIVATE, only the creator can view the notes
    if (wall.getDataValue('privacy') === 'PRIVATE') {
      const session = await getSessionUser();
      if (!session || session.userId !== wall.getDataValue('creatorId')) {
        return NextResponse.json({ error: 'Unauthorized to view this wall' }, { status: 403 });
      }
    }

    // Fetch notes, join User for author name, include Appreciations for hearts count
    const notes = await Note.findAll({
      where: { wallId: wall.getDataValue('id') },
      include: [
        {
          model: Appreciation,
          attributes: ['userId']
        },
        {
          model: User,
          attributes: ['name'],
          required: false // LEFT JOIN — anonymous notes have no author
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedNotes = notes.map((note: any) => {
      const plainNote = note.get({ plain: true });
      return {
        id: plainNote.id,
        text: plainNote.text,
        color: plainNote.color,
        font: plainNote.font || 'font-sans',
        isAnonymous: plainNote.isAnonymous,
        authorId: plainNote.authorId,
        authorName: plainNote.isAnonymous ? null : (plainNote.User?.name ?? null),
        createdAt: plainNote.createdAt,
        heartsCount: plainNote.Appreciations ? plainNote.Appreciations.length : 0,
      };
    });

    return NextResponse.json({ notes: formattedNotes });
  } catch (error) {
    console.error('GET notes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wall = await Wall.findOne({ where: { slug } });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found' }, { status: 404 });
    }

    const body = await req.json();
    const { text, color, font, isAnonymous } = body;

    const session = await getSessionUser();

    // Fetch user plan
    let userPlan = 'FREE';
    if (session) {
      const user = await User.findByPk(session.userId, { attributes: ['plan'] });
      if (user) userPlan = user.getDataValue('plan');
    }

    if (userPlan === 'FREE') {
      if (!text || text.length > 200) {
        return NextResponse.json({ error: 'Free plan notes are limited to 200 characters' }, { status: 403 });
      }

      const premiumColors = ['bg-[#DFE4F2]', 'bg-[#F3CAD9]', 'bg-[#EAEAC2]', 'bg-[#E6E4E6]'].slice(2);
      if (color && premiumColors.includes(color)) {
        return NextResponse.json({ error: 'This color requires the Pro plan' }, { status: 403 });
      }

      if (font && font !== 'font-sans') {
        return NextResponse.json({ error: 'Handwriting fonts require the Pro plan' }, { status: 403 });
      }
    } else {
      if (!text || text.length > 5000) {
        return NextResponse.json({ error: 'Text is required and must be under 5000 characters' }, { status: 400 });
      }
    }

    // Enforce wall anonymity settings
    if (!wall.getDataValue('allowAnonymous') && !session) {
      return NextResponse.json({ error: 'This wall requires you to be logged in to post' }, { status: 401 });
    }

    const newNote = await Note.create({
      text,
      color: color || '0',
      font: font || 'font-sans',
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      wallId: wall.getDataValue('id'),
      authorId: session ? session.userId : null,
    });

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    console.error('POST note error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
