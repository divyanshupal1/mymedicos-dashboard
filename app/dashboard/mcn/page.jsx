import admin from "@/lib/firebase-admin";
import { McnDisplay } from "./mcnDisplay";


export default async function Home() {    

    function fetchData(){
        return new Promise(async(resolve)=>{
            const docSnap = await admin.firestore().collection("Medical Council Number Request").get();
            let temp = [];
            docSnap.forEach((doc) => {
                temp.push([doc.id,doc.data()]);
            });
            if(docSnap.size==temp.length){
                resolve(temp)
            }
        })
    }
    const temp =await fetchData()
    console.log(temp)
    return <McnDisplay data={temp}/>
}