"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection,getDocs,where,query,updateDoc,deleteDoc,doc } from 'firebase/firestore'
import { McnDisplay } from "./mcnDisplay"


export default function Home() {
    const [data, setData] = useState([])
    async function request(){
        const docSnap = await getDocs(collection(db, "Medical Council Number Request"));
        var temp = [];
        docSnap.forEach((doc) => {
            temp.push([doc.id,doc.data()]);
        });
        setData(temp);
    }
    // const requests = db.collection('Medical Council Number Request').get()
    return <McnDisplay data={data} reload={request}/>
}