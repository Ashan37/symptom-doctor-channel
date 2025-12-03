import {NextResponse} from 'next/server';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/library/auth";
import {prisma} from "@/app/library/prisma";

export async function POST(req:Request){
    const session=await getServerSession(authOptions);

    if(!session?.user?.email){
        return NextResponse.json(
            {error:'Only patients can submit symptoms'},
            {status:403}
        )
    }

    try{
        const{title,description,urgency}=await req.json();

        if(!title || !description || !urgency){
            return NextResponse.json(
                {error:'Missing required fields'},
                {status:400}
            )
        }
        
        const user = await prisma.user.findUnique({
            where:{email:session.user.email},
        })

        if(!user){
            return NextResponse.json(
                {error:'User not found'},
                {status:404}
            )
        }

        const patient = await prisma.patient.findUnique({
            where:{userId:user.id},
        })

        if(!patient){
            return NextResponse.json(
                {error:'Only patients can submit symptoms'},
                {status:403}
            )
        }
        const report=await prisma.symptom.create({
            data:{
                title,
                description,
                urgency:urgency,
                patientId:patient.id
            }
        })
        return NextResponse.json(report);
    }catch(error){
        return NextResponse.json(
            {error:'Internal Server Error'},
            {status:500}
        )
    }
}