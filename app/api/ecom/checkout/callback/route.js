import Razorpay from "razorpay";
import { validatePaymentVerification, validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { FRONTEND_HOST } from "@/app/constants";
import axios from "axios";
import admin from "@/lib/firebase-admin";


export async function POST(req,res){
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = await req.json();
    console.log(razorpay_payment_id,razorpay_order_id,razorpay_signature);

    if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature){
        return Response.redirect(`${FRONTEND_HOST}/checkout/failure`);
    }

    const result = await validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET);
    
    if(!result){
        return Response.redirect(`${FRONTEND_HOST}/checkout/failure`);
    }

    await axios.get(`${FRONTEND_HOST}/api/ecom/checkout/orderDetails/${razorpay_order_id}`)
    .then(async(response) => {
        if(response.data.type == "medcoins"){
            const db = admin.database();
            const ref = db.ref('profiles');
            const usersRef = ref.child(`${response.data.user}/coins`);
            switch (response.data.amount) {
                case 99:
                    usersRef.transaction((current_value)=>{
                        return current_value + 150 
                    });                    
                    break;
                case 129:
                    usersRef.transaction((current_value)=>{
                        return current_value + 200 
                    });                     
                    break;
                case 199:
                    usersRef.transaction((current_value)=>{
                        return current_value + 350 
                    });                    
                    break;            
                default:
                    break;
            }
        }
        else{
            const user = await admin.firestore().collection("users").where("Phone Number", "==", response.data.user.phone).get()
            const user_id = user.docs[0].id;
            var library = user.docs[0].data().library ? user.docs[0].data().library : [];
            console.log(library,"library");
            var newLibrary = [...library, ...response.data.items];
            admin.firestore().collection("users").doc(user_id).update({
                library: newLibrary,
            });
        }
    })

    return Response.redirect(`${FRONTEND_HOST}/checkout/success`);
}
