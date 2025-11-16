import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Supply from "@/models/Supply";
import SupplyLog from "@/models/SupplyLog";

export async function PUT(req: Request, { params }: any) {
  try {
    await connectDB();
    const id = params.id;
    const { action } = await req.json();

    const item = await Supply.findById(id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    if (action === "increase") {
      item.quantity += 1;
      await SupplyLog.create({
        itemId: id,
        action: "INCREASE",
        description: `Increased ${item.name} by 1`,
      });
    }

    if (action === "decrease" && item.quantity > 0) {
      item.quantity -= 1;
      await SupplyLog.create({
        itemId: id,
        action: "DECREASE",
        description: `Decreased ${item.name} by 1`,
      });
    }

    await item.save();
    return NextResponse.json(item);

  } catch (error) {
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
  try {
    await connectDB();
    const id = params.id;

    const item = await Supply.findById(id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    await SupplyLog.create({
      itemId: id,
      action: "DELETE",
      description: `Deleted item: ${item.name}`,
    });

    await item.deleteOne();
    return NextResponse.json({ message: "Item deleted" });

  } catch {
    return NextResponse.json({ error: "Cannot delete item" }, { status: 500 });
  }
}
