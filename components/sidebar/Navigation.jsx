"use client"
import Link from 'next/link'

export default function Navigation({active,href,children}){
    return (
        <>
            <Navtab href='/publications' active >Publications</Navtab>
            <Navtab href='/' >News</Navtab>
            <Navtab href='/' >UG Uploads</Navtab>
            <Navtab href='/' >PG Uploads</Navtab>
            <Navtab href='/' >University Updates</Navtab>
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