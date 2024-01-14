import Razorpay from "razorpay";
import admin from "@/lib/firebase-admin";



export const dynamic = 'force-dynamic'





export async function GET(req,{params}) {

    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

  try{
    const {id} = params
    const db = admin.firestore();
    const docSnap = await db.collection('users').doc(id[0]).get();
    const user = docSnap.data();
    console.log(docSnap.data());
    const docid = docSnap.id;
    const cart = user.cart;
    if(cart.length === 0){
        return new Response(JSON.stringify({status:"error",message:"cart is empty"}));
    }

    async function calcPrice(index=0,price=0,items=[]){
        if(index === cart.length){
            return [price,items];
        }
        const itemID = cart[index];
        const itemSnap =await db.collection('Publications').doc(itemID).get();
        const item = itemSnap.data()
        price += item.Price;
        items.push(item)        
        return calcPrice(index+1,price,items);
    }

    const [price,items] = await calcPrice();

    var options = {
        amount: price*100,
        currency: "INR",
    };
    const order = await instance.orders.create(options)
    await db.collection('Orders').doc(order.id).set({
        order_id: order.id,
        items: cart,
        user: user.DocID,
        status: "pending",
        amount: price,
        currency: "INR",
        razorpay_payment_id: null,
        razorpay_signature: null,
        created_at: new Date(),
        updated_at: new Date(),
    });
    await db.collection('users').doc(docid).update({
        cart: []
    })

    return new Response(JSON.stringify({status:"success",order_id:order.id}));
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify({status:"error",message:"some error occured"}));
    }
}