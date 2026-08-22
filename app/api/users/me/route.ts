import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { User, Wall, Note, Appreciation } from '../../../../lib/sequelize';

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(session.userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Aggregate lifetime stats
    const wallsCreated = await Wall.count({ where: { creatorId: session.userId } });
    const notesLeft = await Note.count({ where: { authorId: session.userId } });

    // Count all hearts received on notes created by this user
    const userNotes = await Note.findAll({
      where: { authorId: session.userId },
      include: [{ model: Appreciation }]
    });
    
    const heartsReceived = userNotes.reduce((acc, note: any) => {
      return acc + (note.Appreciations ? note.Appreciations.length : 0);
    }, 0);

    return NextResponse.json({
      user,
      stats: {
        wallsCreated,
        notesLeft,
        heartsReceived
      }
    });
  } catch (error) {
    console.error('GET user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(session.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, bio, tags } = body;

    await user.update({
      name: name !== undefined ? name.trim() : user.getDataValue('name'),
      bio: bio !== undefined ? bio.trim() : user.getDataValue('bio'),
      tags: tags !== undefined ? tags : user.getDataValue('tags'),
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('PATCH user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
