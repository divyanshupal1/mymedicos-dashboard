"use client";

import React from 'react'
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function Page({params}) {

    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
        const loadDets = async ()=>{
            var reqi = `https://mymedicos-dashboard-divyanshup11.vercel.app/api/ecom/checkout/orderDetails/${params.orderID}`  
            const result = await axios.get(reqi);
            setResult(result);
        }
        loadDets();
    }, []);

    if(result==null) return <div className='w-screen h-screen flex justify-center items-center'>Loading...</div>

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
    
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }   
        
        
        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
    
        const { amount, order_id, currency } = result.data;
    
        const options = {
          "key": process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
          "amount":amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": currency,
          "name": "MyMedicos",
          "description": `Order for ${result.data.user.Name}`,
          "order_id": order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          "callback_url": `https://mymedicos-dashboard.vercel.app/api/checkout/callback/`,
          "prefill": {
              "name": result.data.user.Name,
              "email": result.data.user["Email ID"],
              "contact": result.data.user["Phone Number"]
          },
          "notes": {
              "address": "Razorpay Corporate Office"
          },
          "theme": {
              "color": "#3399cc"
          }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
        });
        paymentObject.open();
    }
    console.log(result.user)
    return (
        <>
        <div className='w-screen h-screen flex flex-col justify-between '>
            <div>
                <div className='w-full p-3 py-4 bg-emerald-700 flex justify-between'>
                    <div className='font-medium text-white'>MyMedicos - Checkout</div>   
                    <div className='text-white text-sm'>{params.orderID}</div>         
                </div>
                <div className='w-full  p-1'>
                    <div className='flex gap-x-6 justify-start items-center rounded-md border p-3 bg-slate-300'>
                        <Avatar>
                            {/* <AvatarImage src="https://github.com/shadcn.pnsg" /> */}
                            <AvatarFallback>{result.data.user.Name}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className='font-medium'>{result.data.user.Name}</div>
                            <div className='font-medium'>{result.data.user["Email ID"]}</div>
                        </div>                        
                    </div>
                    <div className=' font-medium p-3'>Order Items</div>
                    <div className='flex flex-col justify-center items-center p-1 overflow-y-scroll'>
                        {result.data.items.map((item,index)=>{
                            return <ItemCard key={index} id={item}/>
                        })}
                    </div>

                </div>
                
            </div>
            
            
            <div className='w-full'>
                <div className='flex flex-col justify-center items-center mb-4'>
                    <div className='font-medium'>Total Amount: ₹{result.data.amount}</div>
                </div>
                <button id="rzp-button1" className='bg-blue-500 p-3 text-white w-full' onClick={displayRazorpay}>Pay Now</button>
            </div>
        </div>
        </>
    )
}

export default Page

import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase";

export function ItemCard({id}){
    const [result, setResult] = React.useState(null);
    React.useEffect(() => {
        const loadDets = async ()=>{
            const docRef = doc(db, "Publications", id);
            const docSnap = await getDoc(docRef)
            const order = docSnap.data();
            setResult(order);
        }
        loadDets();
    }, []);
    if(result==null) return <div className='p-3'>Loading...</div>
    return (
        <>
            <div className='flex gap-x-6 justify-start items-center rounded-md border p-3 overflow-hidden w-full'>
                <img src={result.thumbnail} alt='product thumbnail' width={"100px"} height={"100%"}></img>
                <div>
                    <div className='font-medium whitespace-nowrap overflow-hidden text-ellipsis w-[300px]'>{result.Title}</div>
                    <div className='font-medium'>Author: {result.Author}</div>
                    <div className='font-medium'>₹{result.Price}</div>
                </div>                        
            </div>
        
        </>
    )
}