import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';



export async function POST(request){
    try {

        const reqBody = await request.json()
        const {username, password} = reqBody;

        //check if user exists
        var user = undefined;
        var q = query(collection(db, "DashboardUsers"), where("username", "==", username));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            var temp = {username: doc.data().username, password: doc.data().password, id: doc.id,role: doc.data().type};
            user = temp;
        });

        if(!user){
            return NextResponse.json({success:false}, {status: 200})
        }

        
        //check if password is correct
        const validPassword = password === user.password?true:false;
        if(!validPassword){
            return NextResponse.json({success:false}, {status: 200})
        }        
        //create token data
        const tokenData = {
            username: user.username,
            id:  user.id,
            role: user.role
        }
        //create token
        const token = jwt.sign(tokenData, process.env.NEXTAUTH_SECRET, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
        
        return response;

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}