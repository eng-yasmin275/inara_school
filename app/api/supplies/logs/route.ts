import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SupplyLog from "@/models/SupplyLog";

export async function GET() {
  try {
    await connectDB();
    const logs = await SupplyLog.find()
      .populate("itemId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(logs);
  } catch {
    return NextResponse.json({ error: "Failed to load logs" }, { status: 500 });
  }
}
