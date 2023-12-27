"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation({active,href,children}){
    let path = usePathname()
    return (
        <>
            <Navtab href='/dashboard/mcn' active={path.split('/')[2] === 'mcn'?true:false} >MCN Requests</Navtab>
            <Navtab href='/dashboard/cme' active={path.split('/')[2] === 'cme'?true:false} >CME</Navtab>
            <Navtab href='/dashboard/publications' active={path.split('/')[2] === 'publications'?true:false} >Publications</Navtab>
            <Navtab href='/dashboard/news' active={path.split('/')[2] === 'news'?true:false} >News</Navtab>
            <Navtab href='/dashboard/uguploads' active={path.split('/')[2] === 'uguploads'?true:false} >UG Uploads</Navtab>
            <Navtab href='/dashboard/pguploads' active={path.split('/')[2] === "pguploads"?true:false} >PG Uploads</Navtab>
            <Navtab href='/dashboard/updates' active={path.split('/')[2] === 'updates'?true:false}>University Updates</Navtab>
            <Navtab href='/dashboard/sliders' active={path.split('/')[2] === 'sliders'?true:false}>Sliders</Navtab>
            <Navtab href='/dashboard/slideshow' active={path.split('/')[2] === 'slideshow'?true:false}>Slideshow</Navtab>
        </>
    )
}

function Navtab({active,href,children}){
    let styles = `w-full py-3 flex items-center px-6 rounded-full font-medium ${active?'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700':'dark:text-white hover:bg-slate-300  dark:hover:bg-slate-800  bg-slate-100 dark:bg-transparent dark:border'}`
    return (
        <>
            <Link href={href}>
                <div className={styles}>{children}</div>
            </Link>
        </>
    )
}