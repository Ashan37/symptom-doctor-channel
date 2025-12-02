import {prisma} from '@/app/library/prisma';
import bcrypt from 'bcrypt';
import {NextResponse} from 'next/server';

export async function POST(req:Request){
    try{
        const {name,email,password,role}=await req.json();

        if(!email|| !password){
            return NextResponse.json({error:'Email and password are required'}, {status:400});

        }
        const hashed=await bcrypt.hash(password,10);

        const user=await prisma.user.create({
            data:{
                name,
                email,
                password:hashed,
                role:role ||"PATIENT"
            }
        })
        if (role==="PATIENT"){
            await prisma.patient.create({
                data:{
                    userId:user.id,
                }
            });
        } else if(role==='DOCTOR'){
            await prisma.doctor.create({
                data:{
                    userId:user.id,
                }
            });
        } else if(role==='ADMIN'){
            await prisma.admin.create({
                data:{
                    userId:user.id,
                }
            });
        }
        return NextResponse.json({message:'User registered successfully',success:true});
    }catch (error){
        console.log('Registration error:',error);
        return NextResponse.json({error:'Internal Server Error'}, {status:500});
    }
}