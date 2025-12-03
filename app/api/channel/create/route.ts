import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {authOptions} from "@/app/library/auth";
import { prisma } from "@/app/library/prisma";

export async function POST(req: Request){
    const session= await getServerSession(authOptions);

    if(!session || !session?.user?.email){
        return NextResponse.json({error:'Not authorized'},{status:403});
    }
    try{
        const {doctorId}=await req.json();

        if(!doctorId){
            return NextResponse.json({error:'Doctor ID is required'},{status:400});
        }

        const user = await prisma.user.findUnique({
            where:{email:session.user.email}
        });

        if(!user || user.role !== "PATIENT"){
            return NextResponse.json({error:'Only patients can create channels'},{status:403});
        }

        const patient = await prisma.patient.findUnique({
            where:{userId:user.id}
        });

        if(!patient){
            return NextResponse.json({error:'Patient not found'},{status:404});
        }

        const existingConsultation = await prisma.consultation.findFirst({
            where:{
                patientId:patient.id,
                doctorId:doctorId
            }
        });

        if(existingConsultation){
            return NextResponse.json({error:'Consultation already exists'},{status:400});
        }

        const consultation = await prisma.consultation.create({
            data:{
                patientId:patient.id,
                doctorId:doctorId
            }
        });

        return NextResponse.json(consultation);
    }catch(error){
        console.error('Error creating consultation:', error);
        return NextResponse.json({error:'Internal Server Error'},{status:500});
    }
}
