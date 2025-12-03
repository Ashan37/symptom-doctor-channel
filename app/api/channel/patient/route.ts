import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/library/auth";
import { prisma } from "@/app/library/prisma";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session || !session?.user?.email){
        return NextResponse.json({error:'Not authorized'},{status:403});    
    }

    try{
        const user = await prisma.user.findUnique({
            where:{email:session.user.email},
        })

        if(!user || user.role !== 'PATIENT'){
            return NextResponse.json({error:'Not authorized'},{status:403});
        }

        const patient=await prisma.patient.findUnique({
            where:{userId:user.id},
        })

        if(!patient){
            return NextResponse.json({error:'Patient not found'},{status:404});
        }

        const consultations=await prisma.consultation.findMany({
            where:{patientId:patient.id},
            include:{
                doctor:{include:{user:true}},
            },
            orderBy:{createdAt:'desc'},
        })
        return NextResponse.json(consultations);
    }catch(error){
        console.error('Error fetching consultations:', error);
        return NextResponse.json({error:'Internal Server Error'},{status:500});
    }
}