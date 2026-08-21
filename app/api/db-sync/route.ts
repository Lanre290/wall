import { NextResponse } from 'next/server';
import { sequelize } from '../../../lib/sequelize';

export async function GET() {
  try {
    await sequelize.sync({ alter: true });
    return NextResponse.json({ message: 'Production database synced successfully!' });
  } catch (error: any) {
    console.error('DB Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
