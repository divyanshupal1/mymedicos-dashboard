"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection,getDocs,where,query,updateDoc,deleteDoc,doc } from 'firebase/firestore'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { de } from 'date-fns/locale'
import { useToast } from '@/components/ui/use-toast'
import {useRouter} from 'next/navigation'
  

export function McnDisplay({ data ,reload}) {
    const {toast} = useToast()
    const [newData, setNewData] = useState([])
    const router = useRouter()

    useEffect(() => {
        data.forEach(async (item, index) => {
            var data1=[]
            var q = query(collection(db,'users'),where('Phone Number','==',item[1]['User']))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                var temp = {name:"",email:"",phone:"",mcn:"",docid:"",user_doc:""};
                temp.name = doc.data().Name;
                temp.email = doc.data()["Email ID"];
                temp.phone = doc.data()['Phone Number'];
                temp.mcn = item[1]['Medical Council Number'];  
                temp.user_doc = doc.id;
                temp.docid = item[0];
                data1.push(temp);  
            });
            setNewData(data1);
        })
    }, [data])

    async function verify(docid, user_doc,index) {
        try{
            const docRef = doc(db, "Medical Council Number Request", docid);
            const docRef1 = doc(db, "users", user_doc);
            await updateDoc(docRef1, {
                "MCN Verified":true
            });
            await deleteDoc(docRef).then(()=>{
                toast({
                    title: "MCN Verified",
                    message: "MCN Verified Successfully",          
                })
            });
            reload();
        }
        catch(e){
            toast({
                title: "Error",
                message: "Something went wrong",          
            })
        }
        
        
    }
    async function reject(docid, user_doc,index) {
        try{
            const docRef = doc(db, "Medical Council Number Request", docid);
            const docRef1 = doc(db, "users", user_doc);
            await updateDoc(docRef1, {
                "MCN Verified":false
            }).then(async ()=>{
                await deleteDoc(docRef).then(()=>{
                    toast({
                        title: "MCN Rejected",
                        message: "MCN Rejected Successfully",          
                    })
                });
            });
            reload();            
        }
        catch(e){
            toast({
                title: "Error",
                message: "Something went wrong",          
            })
        }
        
        
    }

    console.log(newData)
    return (
        <>            
            <div className="flex flex-col w-9/12 mt-9">
                <Table>
                <TableCaption>A list of MCN verification requests.</TableCaption>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">S.No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>MCN Number</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        newData.map((item, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    <TableCell>{item.mcn}</TableCell>
                                    <TableCell className="flex gap-x-3 justify-end">
                                        <Button className="btn btn-primary" onClick={()=>{verify(item.docid,item.user_doc,index)}}>Verify</Button>
                                        <Button variant="secondary" className="btn btn-primary" onClick={()=>{reject(item.docid,item.user_doc,index)}}>Reject</Button>
                                        
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
                </Table>
            </div>
        </>
    )
}

