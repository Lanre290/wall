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
