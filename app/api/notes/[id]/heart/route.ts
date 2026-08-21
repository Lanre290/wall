import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../../lib/auth';
import { Note, Appreciation } from '../../../../../lib/sequelize';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    const { id: noteId } = await params;
    const note = await Note.findByPk(noteId);

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Check if already appreciated to prevent duplicates (only for logged-in users)
    if (session) {
      const existing = await Appreciation.findOne({
        where: { noteId, userId: session.userId }
      });

      if (existing) {
        return NextResponse.json({ message: 'Already appreciated' }, { status: 200 });
      }
    }

    // Create appreciation (userId will be null if anonymous)
    await Appreciation.create({
      noteId,
      userId: session ? session.userId : null,
    });

    return NextResponse.json({ message: 'Note appreciated!' }, { status: 201 });
  } catch (error) {
    console.error('POST heart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: noteId } = await params;

    const appreciation = await Appreciation.findOne({
      where: { noteId, userId: session.userId }
    });

    if (appreciation) {
      await appreciation.destroy();
    }

    return NextResponse.json({ message: 'Appreciation removed' }, { status: 200 });
  } catch (error) {
    console.error('DELETE heart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
