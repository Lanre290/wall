import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../../lib/auth';
import { Note, Wall } from '../../../../lib/sequelize';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: noteId } = await params;
    const body = await req.json();
    const { status } = body;

    const note = await Note.findByPk(noteId);
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const wall = await Wall.findByPk(note.getDataValue('wallId'));
    if (!wall || wall.getDataValue('creatorId') !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized to moderate this wall' }, { status: 403 });
    }

    const currentMetadata = note.getDataValue('metadata') || {};
    const updatedMetadata = {
      ...currentMetadata,
      status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      moderatedAt: new Date().toISOString()
    };

    await note.update({ metadata: updatedMetadata });

    return NextResponse.json({ 
      success: true, 
      noteId: note.getDataValue('id'), 
      status: updatedMetadata.status 
    });
  } catch (error: any) {
    console.error('PATCH note moderation error:', error);
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
    const note = await Note.findByPk(noteId);
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const wall = await Wall.findByPk(note.getDataValue('wallId'));
    if (!wall || wall.getDataValue('creatorId') !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this note' }, { status: 403 });
    }

    await note.destroy();

    return NextResponse.json({ success: true, message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('DELETE note error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
