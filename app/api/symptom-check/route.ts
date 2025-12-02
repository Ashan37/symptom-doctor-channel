import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {analyzeSymptoms} from '@/app/library/ai/ai';

export async function POST(req:NextRequest){
    const body=await req.json();
    const {description, title}=body;
    const aiResult=await analyzeSymptoms({title,description});
    return NextResponse.json({aiResult});
}
