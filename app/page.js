"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {db} from '@/lib/firebase'
import { useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore"; 

export default function Home() {
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
    <main className="flex items-center justify-between">
      <Button>Click me</Button>
    </main>
  );
}
