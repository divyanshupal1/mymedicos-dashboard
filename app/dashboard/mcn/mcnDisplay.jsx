"use client"
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, where, query, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';


async function getUserDataByPhoneNumber(phoneNumber) {
  const q = query(collection(db, 'users'), where('Phone Number', '==', phoneNumber));
  const querySnapshot = await getDocs(q);

  const userData = [];
  querySnapshot.forEach((doc) => {
    const temp = {
      name: doc.data().Name,
      email: doc.data()["Email ID"],
      phone: doc.data()['Phone Number'],
      mcn: "",
      user_doc: doc.id,
      docid: "",
    };

    userData.push(temp);
  });

  return userData;
}

export function McnDisplay() {
  const { toast } = useToast();
  const [newData, setNewData] = useState([]);

  async function loadData(){
    var temp =[]
    const mcn_docSnap = await getDocs(collection(db, "Medical Council Number Request"));
    mcn_docSnap.forEach( async (doc) => {
        var id = doc.id;
        var data = doc.data();
        const userData = await getUserDataByPhoneNumber(data['User']);
        temp.push({...userData,mcn:data['Medical Council Number'],docid:id})
    });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    }).then(() => {
      setNewData(temp);
    });

  }


  useEffect(() => {    
    loadData();
  },[]);


  async function handleVerification(docid, user_doc, index, isVerified) {
    try {
      const docRef = doc(db, "Medical Council Number Request", docid);
      const docRef1 = doc(db, "users", user_doc);

      await updateDoc(docRef1, {
        "MCN Verified": isVerified,
      });

      await deleteDoc(docRef).then(() => {
        const toastMessage = isVerified ? "MCN Verified Successfully" : "MCN Rejected Successfully";
        toast({
          title: isVerified ? "MCN Verified" : "MCN Rejected",
          message: toastMessage,
        });
        setNewData(()=>[])
        loadData();
      });

    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        message: "Something went wrong",
      });
      setNewData(()=>[])
      loadData();
    }
  }

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
            {newData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item[0].name}</TableCell>
                <TableCell>{item[0].email}</TableCell>
                <TableCell>{item[0].phone}</TableCell>
                <TableCell>{item[0].mcn}</TableCell>
                <TableCell className="flex gap-x-3 justify-end">
                  <Button className="btn btn-primary" onClick={() => handleVerification(item.docid, item[0].user_doc, index, true)}>
                    Verify
                  </Button>
                  <Button variant="secondary" className="btn btn-primary" onClick={() => handleVerification(item.docid, item[0].user_doc, index, false)}>
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
