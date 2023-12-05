import { NextResponse } from "next/server";
import { db } from '@/lib/firebase';
import { doc, updateDoc,arrayUnion, arrayRemove,getDoc  } from "firebase/firestore";
import admin from "@/lib/firebase-admin";



export async function POST(req,{params},res){
    const {id} = params
    const firestore = admin.firestore();

    const docRef = doc(db, "users", id[0]);

    if(id[1] === "get"){
        try{
            const user = await firestore.collection('users').doc(id[0]).get()
            const cart = user.data().cart;
            
            const cartSize = cart.length;
            
            return new Promise((resolve) => {
                var products = []
                cart.forEach(async(element,index) => {
                    console.log(element)
                    var itemDetails = await firestore.collection('Publications').doc(element).get()
                    const pdata = itemDetails.data()
                    pdata.URL = ""
                    pdata.id = itemDetails.id
                    products.push(pdata)
                   if(cartSize-1==index) resolve(products)
                });
                
              })
              .then((products)=>{
                return new Response(JSON.stringify({status:"success",data:products}))
              }); 
        }
        catch(e){
            console.log(e)
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