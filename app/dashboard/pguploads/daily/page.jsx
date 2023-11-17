"use client"
import React from 'react'
import { AddDailyQuiz } from '@/components/system/quiz/addDailyQuiz'


function Page() {
  
  async function loadQuiz(){
    var data=[];
    const q = query(collection(db, "PGupload", "Daily", "Quiz"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data())
    });
  }

  return (
    <div className='w-full flex justify-end p-3'><AddDailyQuiz/></div>
  )
}

export default Page
