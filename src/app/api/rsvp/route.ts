import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const wishes = await prisma.rsvp.findMany({
    orderBy: { createdAt: "desc" },
    include: { guest: true },
  })

  const hadir = wishes.filter((w) => w.status === "attending").length
  const tidakHadir = wishes.filter((w) => w.status === "not_attending").length

  return NextResponse.json({ wishes, hadir, tidakHadir })
}

export async function POST(req: Request) {
  const { name, message, status } = await req.json()
  if (!name || !message) {
    return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 })
  }

  await prisma.guest.create({
    data: {
      name,
      rsvp: {
        create: {
          status,
          message,
        },
      },
    },
  })

  return NextResponse.json({ success: true })
}
