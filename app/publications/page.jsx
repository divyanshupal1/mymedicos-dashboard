"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ref,uploadBytes,getDownloadURL } from "firebase/storage"
import { db,storage } from "@/lib/firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { v4 } from "uuid"

export default function Home() {

  async function uploadfile(e){
    const storageRef = ref(storage, 'Publications/files/'+v4());
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {

      console.log('Uploaded a blob or file!');
       try {
        async function addData(){
          var fileurl = "";
          await getDownloadURL(snapshot.ref).then((downloadURL) => {
            fileurl = String(downloadURL);
          });
          const docRef = await addDoc(collection(db, "Publications"), {
            Author: "Ada",
            Title: "Lovelace",
            Price: 1815,
            Categort:'Free',
            thumbnail: fileurl,
            URL: fileurl,
          });
          console.log("Document written with ID: ", docRef.id);
        }
        addData();
        }
        catch (e) {
          console.error("Error adding document: ", e);
        }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <Card className="w-[450px] border-none outline-none shadow-none mt-16">
      
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-5">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Title of the Book" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" placeholder="Author of the Book" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="Category">Category</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">All</SelectItem>
                  <SelectItem value="sveltekit">Free</SelectItem>
                  <SelectItem value="astro">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type='number' placeholder="(INR) 240" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Upload File</Label>
              <Input id="price" onChange={(e)=>uploadfile(e)} type='file' />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Publish</Button>
      </CardFooter>
    </Card>
  )
}
