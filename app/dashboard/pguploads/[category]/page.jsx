"use client"
import React, { useEffect } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function News({params}) {
  const path = usePathname()

  return (
    <div className=' flex justify-center w-full mt-40 gap-x-4'>
      <Link href={path+"/daily?a="+params.category}>
        <div className='p-3 px-5 bg-primary rounded-full text-white text-lg font-bold'>Daily Quiz</div>
      </Link>
      <Link href={path+'/weekly?a='+params.category}>
        <div className='p-3 px-5 bg-primary rounded-full text-white text-lg font-bold'>Weekly Quiz</div>
      </Link>
      <Link href={path+'/notes?a='+params.category}>
        <div className='p-3 px-5 bg-primary rounded-full text-white text-lg font-bold'>Notes</div>
      </Link>
      <Link href={path+'/videos?a='+params.category}>
        <div className='p-3 px-5 bg-primary rounded-full text-white text-lg font-bold'>Videos</div>
      </Link>

    </div>
  )
}

export default News