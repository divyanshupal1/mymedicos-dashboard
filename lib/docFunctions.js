import { db,storage } from "@/lib/firebase"
import { collection, addDoc, updateDoc ,doc, deleteDoc,getDocs } from "firebase/firestore"; 
import { ref,uploadBytesResumable,getDownloadURL } from "firebase/storage"
import { v4 } from 'uuid';

export async function getData(collectionName) {
  try{
    const querySnapshot = await getDocs(collection(db, collectionName));
    var temp = []
    querySnapshot.forEach((doc) => { 
      temp = [...temp,[doc.id,doc.data()]];
    });
    return temp;
  }
  catch(e){
    return false;
  } 
}
export async function insertData(collectionName, data) {
  try{
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  }
  catch(e){
    return false;
  }
}
export async function updateData(collectionName,id, data,callback=()=>{}) {
  try{
    const documentRef = doc(db, collectionName, id);
    const updatedDoc = await updateDoc(documentRef,data ).then(()=>{
      callback();
      return true;
    });
    
  }
  catch(e){
    throw new Error(e);
  }
}
export async function deleteData(collectionName,id) {
  await deleteDoc(doc(db, "cities", "DC")).then(() => {return true}).catch((error) => {return false});
}
export async function uploadFile(dir,file,setProgress,setUrl,callback=()=>{}) {
  const storageRef = ref(storage, dir + v4() + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
    }, 
    (error) => {
      return false;
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setUrl(downloadURL);
        // callback();
        return downloadURL;
      });
    }
  );
}

