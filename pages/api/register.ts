import bcrypt from 'bcrypt';
import { NextApiRequest,NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';


export default async (req:NextApiRequest,res:NextApiResponse) => {
    if(req.method !== 'POST'){
        return res.status(405).end();
    }

    try {
        const {email,password,name} = req.body;

        const existingUser = await prismadb.user.findUnique({where:{email}});
        if(existingUser){
            return res.status(422).json({error:'User with this email Id alread exist'});
        }

        const hashedPassWord = await bcrypt.hash(password,12);

        const user = await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassWord,
                image: '',
                emailVerified: new Date(),
            }
        })

        return res.status(200).json(user);


    } catch (error) {
        console.log(error);
        return res.status(400).end();
        }
}