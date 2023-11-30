import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function urlMerger(url){
  const arr = url.split('%20')
  const str = arr.join(' ')
  return str
}