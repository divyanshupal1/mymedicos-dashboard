import React from 'react'

import Ugcards from './ugcard';
import { Button } from '@/components/ui/button';

async function News() {
  return (
    <div className='w-full h-full flex flex-col'>
    <Ugcards/>
    </div>
  )
}

export default News