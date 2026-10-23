import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../../lib/auth';
import { Wall, Note, Appreciation, User, ensureSchema } from '../../../../../lib/sequelize';
import { UAParser } from 'ua-parser-js';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await ensureSchema();
    const { slug } = await params;
    const wall = await Wall.findOne({ where: { slug } });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found' }, { status: 404 });
    }

    const session = await getSessionUser();

    // If PRIVATE, only the creator can view the notes
    if (wall.getDataValue('privacy') === 'PRIVATE') {
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

    const isCreator = session && session.userId === wall.getDataValue('creatorId');

    const formattedNotes = notes
      .filter((note: any) => {
        const plainNote = note.get({ plain: true });
        const status = plainNote.metadata?.status;
        if (status === 'PENDING' && !isCreator) {
          return false; // Hide pending notes from non-creators
        }
        if (status === 'REJECTED') {
          return false; // Never show rejected notes
        }
        return true;
      })
      .map((note: any) => {
        const plainNote = note.get({ plain: true });
        const isPending = plainNote.metadata?.status === 'PENDING';
        return {
          id: plainNote.id,
          text: plainNote.text,
          color: plainNote.color,
          font: plainNote.font || 'font-sans',
          sticker: plainNote.metadata?.sticker || null,
          isAnonymous: plainNote.isAnonymous,
          authorId: plainNote.authorId,
          authorName: plainNote.isAnonymous ? null : (plainNote.User?.name ?? null),
          createdAt: plainNote.createdAt,
          heartsCount: plainNote.Appreciations ? plainNote.Appreciations.length : 0,
          metadata: isCreator ? plainNote.metadata : null,
          isPending: isCreator ? isPending : false,
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
    await ensureSchema();
    const { slug } = await params;
    const wall = await Wall.findOne({ where: { slug } });

    if (!wall) {
      return NextResponse.json({ error: 'Wall not found' }, { status: 404 });
    }

    const body = await req.json();
    const { text, color, font, isAnonymous, clientMetadata, sticker } = body;

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

      if (font === 'font-draw' || text.startsWith('data:image/')) {
        return NextResponse.json({ error: 'Handwritten drawing requires a paid plan' }, { status: 403 });
      }

      const premiumColors = ['bg-[#F3CAD9]', 'bg-[#E6E4E6]'];
      if (color && premiumColors.includes(color)) {
        return NextResponse.json({ error: 'This color requires the Pro plan' }, { status: 403 });
      }

      if (font && font !== 'font-sans') {
        return NextResponse.json({ error: 'Handwriting fonts require the Pro plan' }, { status: 403 });
      }

      if (sticker && sticker !== 'none') {
        return NextResponse.json({ error: 'Decorative stickers require a paid plan' }, { status: 403 });
      }
    } else {
      const isDrawing = font === 'font-draw' || text.startsWith('data:image/');
      const maxLength = isDrawing ? 1000000 : 5000;
      if (!text || text.length > maxLength) {
        return NextResponse.json({ error: `Note must be under ${maxLength} characters` }, { status: 400 });
      }
    }

    // Enforce wall anonymity settings
    if (!wall.getDataValue('allowAnonymous') && !session) {
      return NextResponse.json({ error: 'This wall requires you to be logged in to post' }, { status: 401 });
    }

    // Capture location and device info
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown IP';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown City';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown Country';
    const lat = req.headers.get('x-vercel-ip-latitude');
    const lon = req.headers.get('x-vercel-ip-longitude');
    const userAgentStr = req.headers.get('user-agent') || 'Unknown Device';

    const parser = new UAParser(userAgentStr);
    const parsedDevice = parser.getResult();

    const serverMetadata = {
      ip,
      city,
      country,
      lat,
      lon,
      deviceModel: parsedDevice.device.model || 'Unknown Model',
      deviceVendor: parsedDevice.device.vendor || 'Unknown Vendor',
      deviceType: parsedDevice.device.type || 'desktop',
      osName: parsedDevice.os.name || 'Unknown OS',
      browserName: parsedDevice.browser.name || 'Unknown Browser',
    };

    const requireApproval = !!wall.getDataValue('requireApproval');
    const isCreatorPosting = !!(session && session.userId === wall.getDataValue('creatorId'));
    const noteStatus = (requireApproval && !isCreatorPosting) ? 'PENDING' : 'APPROVED';

    const combinedMetadata = {
      ...serverMetadata,
      ...(clientMetadata || {}),
      status: noteStatus,
      sticker: sticker && sticker !== 'none' ? sticker : null
    };

    const newNote = await Note.create({
      text,
      color: color || '0',
      font: font || 'font-sans',
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
      wallId: wall.getDataValue('id'),
      authorId: session ? session.userId : null,
      metadata: combinedMetadata,
    });

    return NextResponse.json({ 
      note: {
        ...newNote.get({ plain: true }),
        sticker: combinedMetadata.sticker
      }, 
      isPending: noteStatus === 'PENDING' 
    }, { status: 201 });
  } catch (error) {
    console.error('POST note error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
