import { NextResponse } from "next/server";
import { Inquiry, ensureSchema } from "../../../../lib/sequelize";
import { getSessionUser } from "../../../../lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureSchema();
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    if (status) {
      await inquiry.update({ status });
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    console.error("PATCH /api/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureSchema();
    const { id } = await params;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await inquiry.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/inquiries/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
