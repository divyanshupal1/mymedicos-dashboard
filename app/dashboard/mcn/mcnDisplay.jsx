"use client"
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, where, query, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Extracted a separate function to fetch user data by phone number
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

export function McnDisplay({ data, reload }) {
  const { toast } = useToast();
  const router = useRouter();
  const [newData, setNewData] = useState([]);
  const [refresh,setRefresh] =useState(false)

  useEffect(() => {
    // Use Promise.all to wait for all async calls to complete
    Promise.all(
      data.map(async (item) => {
        const userData = await getUserDataByPhoneNumber(item[1]['User']);
        const updatedData = userData.map((user) => ({
          ...user,
          mcn: item[1]['Medical Council Number'],
          docid: item[0],
        }));
        setNewData((prevData) => [...prevData, ...updatedData]);
      })
    );

    // Added missing parentheses to invoke the router.refresh method
  }, [data,refresh]);

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
      });
      setNewData([])
      setRefresh(!refresh)
      // Moved router.refresh outside of deleteDoc.then to ensure refresh is triggered
      router.refresh();
    } catch (e) {
      toast({
        title: "Error",
        message: "Something went wrong",
      });
  
      setRefresh(!refresh)
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.mcn}</TableCell>
                <TableCell className="flex gap-x-3 justify-end">
                  <Button className="btn btn-primary" onClick={() => handleVerification(item.docid, item.user_doc, index, true)}>
                    Verify
                  </Button>
                  <Button variant="secondary" className="btn btn-primary" onClick={() => handleVerification(item.docid, item.user_doc, index, false)}>
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
