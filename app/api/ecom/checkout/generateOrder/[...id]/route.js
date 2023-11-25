import Razorpay from "razorpay";
import { db } from '@/lib/firebase';
import { doc, setDoc,getDoc,updateDoc  } from "firebase/firestore";



export const dynamic = 'force-dynamic'





export async function GET(req,{params}) {

    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

  try{
    const {id} = params
    const docRef = doc(db, "users", id[0]);
    const docSnap = await getDoc(docRef)
    const user = docSnap.data()
    const cart = user.cart;
    if(cart.length === 0){
        return new Response(JSON.stringify({status:"error",message:"cart is empty"}));
    }

    async function calcPrice(index=0,price=0,items=[]){
        if(index === cart.length){
            return [price,items];
        }
        const itemID = cart[index];
        const docRef = doc(db, "Publications", itemID);
        const docSnap = await getDoc(docRef)
        const item = docSnap.data()
        price += item.Price;
        items.push(item)        
        console.log(price,items);
        return calcPrice(index+1,price,items);
    }

    const [price,items] = await calcPrice();

    var options = {
        amount: price*100,
        currency: "INR",
    };
    const order = await instance.orders.create(options)
    await setDoc(doc(db, "Orders", order.id), {
        order_id: order.id,
        items: cart,
        user: id[0],
        status: "pending",
        amount: price,
        currency: "INR",
        razorpay_payment_id: null,
        razorpay_signature: null,
        created_at: new Date(),
        updated_at: new Date(),
    });

    await updateDoc(docRef, {
        cart: []
    });

    // console.log("hello");
    return new Response(JSON.stringify({status:"success",order_id:order.id}));
    }
    catch(e){
        console.log(e);
        return new Response(JSON.stringify({status:"error",message:"some error occured"}));
    }
}