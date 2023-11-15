import { getData } from "@/lib/docFunctions"
import { NextResponse } from "next/server"

export async function GET(req,{params}) {
    console.log(params)
    const temp = await getData("Sliders")
    console.log(temp)//[[id,{images:[{id,url,action},{id,url,action}]}],[id,{images:[{id,url,action},{id,url,action}]}]]
    var data = []
    temp.forEach((slider,index)=>{
        var id = slider[0]
        var images = slider[1].images
        var newData= [id,images]
        data.push(newData)
    })
    if(params.category!==undefined){
        var filteredData=[];
        data.forEach((slider,index)=>{
            if(slider[0]==params.category[0]){
                filteredData = slider;
            }   
        }) 
        return new NextResponse(JSON.stringify(filteredData),{status: 200, headers: { 'Content-Type': 'application/json' }})           
    }
    return new NextResponse(JSON.stringify(data),{status: 200, headers: { 'Content-Type': 'application/json' }})  

}