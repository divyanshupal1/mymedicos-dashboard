import { TimelyQuiz } from '@/components/system/quiz/timelyQuiz'
import React from 'react'

function Page({params}) {
  return (
    <div className='w-full flex justify-end p-3'><TimelyQuiz speciality={params.category}/></div>
  )
}

export default Page