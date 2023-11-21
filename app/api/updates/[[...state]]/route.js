import { db} from "@/lib/firebase"
import { doc,getDoc,getDocs,collection} from "firebase/firestore"; 

export async function GET(req,{params}){

    var paramsSize=0;
    if(params.state){
        paramsSize = params.state.length;
    }
    if(paramsSize == 0){
        const docRef = doc(db, "Updates", "States");
        const docSnap = await getDoc(docRef);
        var data = docSnap.data().data;
        return new Response(JSON.stringify({status:"success",data}))
    }
    if(paramsSize == 1){
        var data;
        const querySnapshot = await getDocs(collection(db, "Updates",params.state[0],"Institutions"));
        querySnapshot.forEach((doc) => {
          data = doc.data().data;
        }); 
        return new Response(JSON.stringify({status:"success",data}))
    }
    if(paramsSize == 2){
        var temp = []
        const querySnapshot = await getDocs(collection(db, "Updates",params.state[0],params.state[1]));
        querySnapshot.forEach((doc) => {
             temp = [...temp,doc.data()]
        });  
        return new Response(JSON.stringify({status:"success",data:temp}))
    }
    return new Response(JSON.stringify({status:"error",message:"Invalid Request"}))
}