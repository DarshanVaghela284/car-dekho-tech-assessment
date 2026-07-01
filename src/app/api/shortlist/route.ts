import { NextRequest, NextResponse } from "next/server";
import { ensureDbSeeded } from "@/lib/db-init";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE = "carmatch_session";

function getSessionId(request: NextRequest): string {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  return existing ?? uuidv4();
}

async function getOrCreateShortlist(sessionId: string) {
  return prisma.shortlist.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
    include: {
      items: {
        include: { car: true },
        orderBy: { addedAt: "desc" },
      },
    },
  });
}

export async function GET(request: NextRequest) {
  await ensureDbSeeded();
  const sessionId = getSessionId(request);
  const shortlist = await getOrCreateShortlist(sessionId);

  const response = NextResponse.json({
    items: shortlist.items.map((item) => ({
      id: item.id,
      addedAt: item.addedAt,
      car: item.car,
    })),
  });

  if (!request.cookies.get(SESSION_COOKIE)) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}

export async function POST(request: NextRequest) {
  await ensureDbSeeded();
  const sessionId = getSessionId(request);
  const { carId } = await request.json();

  if (!carId) {
    return NextResponse.json({ error: "carId is required" }, { status: 400 });
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  const shortlist = await getOrCreateShortlist(sessionId);

  const existing = await prisma.shortlistItem.findUnique({
    where: { shortlistId_carId: { shortlistId: shortlist.id, carId } },
  });

  if (!existing) {
    const count = await prisma.shortlistItem.count({ where: { shortlistId: shortlist.id } });
    if (count >= 5) {
      return NextResponse.json({ error: "Shortlist limited to 5 cars" }, { status: 400 });
    }
    await prisma.shortlistItem.create({
      data: { shortlistId: shortlist.id, carId },
    });
  }

  const updated = await getOrCreateShortlist(sessionId);
  const response = NextResponse.json({
    items: updated.items.map((item) => ({ id: item.id, addedAt: item.addedAt, car: item.car })),
  });

  if (!request.cookies.get(SESSION_COOKIE)) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return response;
}

export async function DELETE(request: NextRequest) {
  await ensureDbSeeded();
  const sessionId = getSessionId(request);
  const { carId } = await request.json();

  const shortlist = await prisma.shortlist.findUnique({ where: { sessionId } });
  if (!shortlist) {
    return NextResponse.json({ items: [] });
  }

  if (carId) {
    await prisma.shortlistItem.deleteMany({ where: { shortlistId: shortlist.id, carId } });
  } else {
    await prisma.shortlistItem.deleteMany({ where: { shortlistId: shortlist.id } });
  }

  const updated = await getOrCreateShortlist(sessionId);
  return NextResponse.json({
    items: updated.items.map((item) => ({ id: item.id, addedAt: item.addedAt, car: item.car })),
  });
}
