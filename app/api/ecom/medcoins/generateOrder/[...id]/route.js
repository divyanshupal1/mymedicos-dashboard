import Razorpay from "razorpay";
import admin from "@/lib/firebase-admin";
export const dynamic = 'force-dynamic'

export async function GET(req,{params}) {

  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try{
    const {id} = params;
    const price = id[1]=="package1"? 99 : id[1]=="package2"? 129 : id[1]=="package3"? 199 : 0;
    const db = admin.firestore();
    var options = {
        amount: price*100,
        currency: "INR",
    };
    const order = await instance.orders.create(options)
    await db.collection('Orders').doc(order.id).set({
        order_id: order.id,
        user: id[0],
        status: "pending",
        amount: price,
        currency: "INR",
        type: "medcoins",
        razorpay_payment_id: null,
        razorpay_signature: null,
        created_at: new Date(),
        updated_at: new Date(),
    });

    return new Response(JSON.stringify({status:"success",order_id:order.id}));
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify({status:"error",message:"some error occured"}));
    }
}