import {PrismaAdapter} from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from "./prisma";
import bcrypt from "bcrypt";
import type {AuthOptions} from "next-auth";

export const authOptions:AuthOptions={
    adapter:PrismaAdapter(prisma),
    providers:[
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password:{label:"Password", type:"password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password)return null;

                const user=await prisma.user.findUnique({
                    where:{email:credentials.email}
                })
                if(!user)return null;

                const validPassword=await bcrypt.compare(credentials.password, user.password);
                if(!validPassword)return null;

                return user;
            }
        })
    ],
    session:{
        strategy:'jwt' as const
    },
    pages:{
        signIn:'/login'
    }
}