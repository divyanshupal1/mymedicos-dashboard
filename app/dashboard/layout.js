import Sidebar from '@/components/sidebar/Sidebar'
import Titlebar from '@/components/titlebar'
export default function DashboardLayout({children}){
    return (
        <div className='flex flex-row w-screen h-screen'>
          <Sidebar/>
          <div className='flex flex-col w-[calc(100%-256px)] h-screen'>
            <div className='w-full flex justify-center items-center h-14 border-b font-bold'><Titlebar/></div>
            <div className='w-full flex justify-center h-[calc(100%-56px)]'>
              {children}
            </div>
          </div>
        </div>
    )
}