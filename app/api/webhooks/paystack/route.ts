import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { User } from '../../../../lib/sequelize';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';

    // Verify signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const metadata = event.data.metadata;
      if (metadata && metadata.userId) {
        const userId = metadata.userId;
        
        // Upgrade user to Pro
        const user = await User.findByPk(userId);
        if (user) {
          await user.update({ plan: 'PRO' });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
