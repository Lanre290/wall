import { NextResponse } from 'next/server';
import { User } from '../../../../lib/sequelize';
import { getSessionUser } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    const { reference, tier, userId } = body;

    const targetUserId = session?.userId || userId;
    if (!targetUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upgrade user to PRO (unlocking handwriting fonts, premium themes, exports, etc.)
    await user.update({ plan: 'PRO' });

    return NextResponse.json({ 
      success: true, 
      plan: 'PRO', 
      tier: tier || 'celebration',
      reference 
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
