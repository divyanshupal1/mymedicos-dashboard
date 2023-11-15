"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation({active,href,children}){
    let path = usePathname()
    return (
        <>
            <Navtab href='/publications' active={path === '/publications'?true:false} >Publications</Navtab>
            <Navtab href='/news' active={path === '/news'?true:false} >News</Navtab>
            <Navtab href='/uguploads' active={path === '/uguploads'?true:false} >UG Uploads</Navtab>
            <Navtab href='/pguploads' active={path === '/pguploads'?true:false} >PG Uploads</Navtab>
            <Navtab href='/updates' active={path === '/updates'?true:false}>University Updates</Navtab>
            <Navtab href='/sliders' active={path === '/sliders'?true:false}>Sliders</Navtab>
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