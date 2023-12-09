import React from 'react'
import {EditDialog} from './EditDialog'

function SliderGroup({reload,docs,speciality}) {
  return (
    <div className='w-full h-full '>
        <div className='w-full flex justify-end p-3'><EditDialog reload={reload} speciality={speciality}/></div>
        <div className='w-full h-full p-6 gap-y-6 flex flex-col'>
            {docs.map((slider,index)=><SliderCard key={index} slider={slider} reload={reload}/>)}
        </div>
    </div>
  )
}

export default SliderGroup

function SliderCard({slider,reload}){
    return(
        <div className='w-full h-[320px] shrink-0 overflow-hidden bg-slate-800 border bg-opacity-20 rounded-md p-4 '>
            <div className='w-full flex justify-between items-center'>
                <div className='font-bold text-lg'>{slider[1].title}</div>
                {/* <div><EditDialog reload={reload} data={slider}/></div> */}
            </div>
            <div className='flex gap-x-3 overflow-x-scroll h-[calc(300px-50px)] py-3 scrollbar-custom'>
                {slider[1].images.map((image,index)=><img key={index} src={image.url} alt=""/>)}
            </div>
        </div>
    )
}
