import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MdOutlineMoreVert} from 'react-icons/md'

function UserCard() {
  return (
    <div className='w-full p-2 flex flex-row dark:bg-transparent border rounded-xl relative'>
        
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
       
        <div className="user-info ml-3">
            <div className="name text-sm font-semibold dark:text-white">Divyanshu Pal</div>
            <div className="email text-xs text-gray-400 dark:text-gray-600 w-32 text-ellipsis overflow-clip">divyanshupal77@gmail.com</div>
        </div>
        <div className='absolute right-2'><Options/></div>
    </div>
  )
}

function Options(){
    return (
        <DropdownMenu>
            <DropdownMenuTrigger><MdOutlineMoreVert className='scale-125'/></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserCard