"use client";

import { Button } from "@/components/ui/button"

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "@/lib/firebase";


export default function Home() {
  const { toast } = useToast() 
  const email = "divyanshupal77@gmail.com" 
  const password = "123456789"

  function signIn(){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
      alert("signed in")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }
  return (
    <>

    <main className="flex items-center justify-between">      
    <Button
      onClick={signIn}
    >
      Show Toast
    </Button>
    </main>
    </>

  );
}
