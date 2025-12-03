import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/library/auth"
import { prisma } from "@/app/library/prisma"

export async function GET(){
    const session=await getServerSession(authOptions);

    if(!session || !session?.user?.email){
        return NextResponse.json(
            {error:'Not authorized'},
            {status:403}
        )
    }

    try{
        const user = await prisma.user.findUnique({
            where:{email:session.user.email},
        })

        if(!user || user.role !== 'DOCTOR'){
            return NextResponse.json(
                {error:'Only doctors can view all symptoms'},
                {status:403}
            )
        }

        const reports=await prisma.symptom.findMany({
            include:{
                patient:{
                    include:{
                        user:true
                    },
                },
            },
            orderBy:{createdAt:'desc'}
        });
        return NextResponse.json(reports);
    }catch(error){
        return NextResponse.json(
            {error:'Internal Server Error'},
            {status:500}
        )
    }
}
