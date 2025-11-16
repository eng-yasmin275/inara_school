import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Supply from "@/models/Supply";

export async function GET() {
  try {
    await connectDB();
    const supplies = await Supply.find().sort({ createdAt: -1 });
    return NextResponse.json(supplies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch supplies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newItem = await Supply.create({
      name: body.name,
      quantity: Number(body.quantity),
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add supply" }, { status: 500 });
  }
}
