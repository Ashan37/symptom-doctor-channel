import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/library/auth"
import { prisma } from "@/app/library/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session?.user?.email) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  try {
    const { symptomId, diagnosis, prescription } = await req.json()

    if (!symptomId || !diagnosis) {
      return NextResponse.json(
        { error: "Symptom ID and diagnosis are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Only doctors can give feedback" }, { status: 403 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: user.id },
    })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 })
    }

    const symptom = await prisma.symptom.findUnique({
      where: { id: symptomId },
    })

    if (!symptom) {
      return NextResponse.json({ error: "Symptom not found" }, { status: 404 })
    }

    const consultation = await prisma.consultation.create({
      data: {
        diagnosis,
        prescription: prescription || null,
        patientId: symptom.patientId,
        doctorId: doctor.id,
      },
    })

    return NextResponse.json({ success: true, consultation })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
