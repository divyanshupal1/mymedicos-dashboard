import { getData } from "@/lib/docFunctions"
import { NextResponse } from "next/server"

export async function GET(req,{params}) {
    const temp = await getData("Sliders")
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
        return new NextResponse(JSON.stringify(filteredData[1]),{status: 200, headers: { 'Content-Type': 'application/json' }})           
    }
    return new NextResponse(JSON.stringify(data),{status: 200, headers: { 'Content-Type': 'application/json' }})  

}