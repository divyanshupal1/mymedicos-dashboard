"use client"
import React, { useEffect } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function News() {

  return (
    <div className=' flex justify-center w-full mt-40 gap-x-4'>
      <Link href='/pguploads/daily'>
        <div className='p-3 px-5 bg-primary rounded-full text-white text-lg font-bold'>Daily</div>
      </Link>
      <Link href='/pguploads/weekly'>
        <div className='p-3 px-5 bg-primary rounded-full text-white text-lg font-bold'>Weekly</div>
      </Link>

    </div>
  )
}

export default News