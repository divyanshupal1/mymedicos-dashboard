import { NextResponse } from "next/server";
import { db } from '@/lib/firebase';
import { doc, updateDoc,arrayUnion, arrayRemove,getDoc  } from "firebase/firestore";




export async function POST(req,{params}){
    const {id} = params

    const docRef = doc(db, "users", id[0]);

    if(id[1] === "get"){
        try{
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            return NextResponse.json({status:"success",cart:data.cart}, {status: 200})
        }
        catch(e){
            return NextResponse.json({status:"failed",message:"some error occured"}, {status: 200})
        }
    }
    if(id[1] === "add"){
        try{
            await updateDoc(docRef, {
                cart: arrayUnion(id[2])
            });
            return NextResponse.json({status:"success",message:"item added to cart"}, {status: 200})
        }
        catch(e){
            return NextResponse.json({status:"failed",message:"some error occured"}, {status: 200})
        }
    }
    if(id[1] === "remove"){
        try{
            await updateDoc(docRef, {
                cart: arrayRemove(id[2])
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