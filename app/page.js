"use client";

import { Button } from "@/components/ui/button"

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"







export default function Home() {
  const { toast } = useToast()
  useEffect(() => {
    async function getdata(){
      // const querySnapshot = await getDocs(collection(db, "Publications"));
      // querySnapshot.forEach((doc) => {
      //   console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      // });
      // try {
      //   const docRef = await addDoc(collection(db, "Publications"), {
      //     Author: "Ada",
      //     Title: "Lovelace",
      //     Price: 1815,
      //     Categort:'Free'
      //   });
      //   console.log("Document written with ID: ", docRef.id);
      // } catch (e) {
      //   console.error("Error adding document: ", e);
      // }
    }
    getdata()
  })
  return (
    <>

    <main className="flex items-center justify-between">      
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>
    </main>
    </>

  );
}
