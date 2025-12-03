import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/library/auth"
import { prisma } from "@/app/library/prisma"

interface Params {
  params: { reportId: string }
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)

  if (!session || !session?.user?.email) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const { reportId } = params

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || user.role !== "PATIENT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    })

    if (!patient) {
      return NextResponse.json({ error: "Patient profile missing" }, { status: 404 })
    }

    const symptom = await prisma.symptom.findUnique({
      where: { id: reportId },
    })

    if (!symptom || symptom.patientId !== patient.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const consultations = await prisma.consultation.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: { include: { user: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(consultations)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
