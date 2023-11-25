import { NextResponse } from "next/server";
import { db } from '@/lib/firebase';
import { doc, updateDoc,arrayUnion, arrayRemove,getDoc  } from "firebase/firestore";




export async function POST(req,{params}){
    const {id} = params
    const body = await req.json()
    const docRef = doc(db, "users", id[0]);

    if(body.action === "get"){
        try{
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            return NextResponse.json({status:"success",cart:data.cart}, {status: 200})
        }
        catch(e){
            return NextResponse.json({status:"failed",message:"some error occured"}, {status: 200})
        }
    }
    if(body.action === "add"){
        try{
            await updateDoc(docRef, {
                cart: arrayUnion(body.item)
            });
            return NextResponse.json({status:"success",message:"item added to cart"}, {status: 200})
        }
        catch(e){
            return NextResponse.json({status:"failed",message:"some error occured"}, {status: 200})
        }
    }
    if(body.action === "remove"){
        try{
            await updateDoc(docRef, {
                cart: arrayRemove(body.item)
            });
            return NextResponse.json({status:"success",message:"item removed from cart"}, {status: 200})
        }
        catch(e){
            return NextResponse.json({status:"failed",message:"some error occured"}, {status: 200})
        }
    }

    // await updateDoc(docRef, {
    //     cart: arrayUnion("greater_virginia")
    // });

    return NextResponse.json({status:"error",data:"some error occured"}, {status: 200})
}