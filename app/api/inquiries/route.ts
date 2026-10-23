import { NextResponse } from "next/server";
import { Inquiry, ensureSchema } from "../../../lib/sequelize";
import { getSessionUser } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    await ensureSchema();
    const body = await req.json();
    const { name, email, orgName, eventType, attendees, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required to submit an inquiry." },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim(),
      orgName: (orgName || "").trim(),
      eventType: eventType || "Other",
      attendees: attendees || "Not specified",
      notes: (notes || "").trim(),
      status: "PENDING"
    });

    console.log("New Organization & Event Inquiry received:", {
      id: inquiry.getDataValue("id"),
      name,
      email,
      orgName,
      eventType
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully! Our team will contact you shortly.",
      inquiryId: inquiry.getDataValue("id")
    });
  } catch (error: any) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureSchema();
    const inquiries = await Inquiry.findAll({
      order: [["createdAt", "DESC"]],
      limit: 100
    });

    return NextResponse.json({ inquiries });
  } catch (error: any) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
