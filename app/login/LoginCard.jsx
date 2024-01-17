"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { CheckCircle, Eye} from "lucide-react";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
export function CardWithForm() {
    const router = useRouter()
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [msg, setMsg] = React.useState(null)

    const [loading, setLoading] = React.useState(0)

    React.useEffect(() => {
      if(username.length>5&&password.length>5) setLoading(0)
      else setLoading(3)
    }, [username,password])

    function SignMeIN(){
      setLoading(1)
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username:username, password:password }),
      }).then((res) => res.json()).then((data)=>{
        if(data.success) {
          setMsg("Successfully logged in")
          setLoading(2)
          router.push("/dashboard/publications")
        }
        else{ 
          setMsg("Invalid Credentials")
          setLoading(0)
        }
      })
      .catch((err) => {
        setMsg("Something went wrong")
        setLoading(0)
      })
    }




    return (
      <div className="w-[380px] p-6 rounded-3xl mt-8 dark:bg-slate-900 bg-slate-100 bg-opacity-80 border drop-shadow-md">
          <div >
            <div className="text-lg font-bold leading-4 p-4 text-center">Admin Login</div>
          </div>
          <div className="space-y-5 mt-1 p-4">
            <div className="space-y-2">
              <Label htmlFor="name">Username or Email</Label>
              <Input id="name" name="username" placeholder="Username" className="py-5 bg-primary-foreground" value={username} onChange={(e)=>setUsername(e.target.value)} />
            </div>
            <div className="space-y-2 relative">
              {showPassword?
                <Eye className="absolute bottom-2 right-2 cursor-pointer" onClick={()=>setShowPassword(!showPassword)} onMouseLeave={()=>setShowPassword(!showPassword)}/>:
                <EyeClosedIcon className="absolute bottom-3 right-3 cursor-pointer" onClick={()=>setShowPassword(!showPassword)}/>
              }
              <Label htmlFor="username">Password</Label>
              <Input id="password" name="password" type={showPassword?"text":"password"} className="py-5 bg-primary-foreground" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className="space-y-2 gap-x-4 w-full flex pt-5 justify-center">
              <Button className="px-8 py-5 w-full rounded-full cursor-pointer" onClick={SignMeIN} disabled={loading!=0&&true}>
                {
                  loading==0?"Login":
                  loading==1?<div className="scale-125"><AiOutlineLoading3Quarters className="animate-spin"/></div>:
                  loading==2?<CheckCircle/>:
                  "Login"
                }
              </Button>
            </div>
            {msg&& <div className="space-y-2"><div className="text-sm text-center text-red-700 font-medium">{msg}</div></div>}
          </div>

        </div>
      // <Card className="w-[350px]">
      //   <CardHeader>
      //     <CardTitle>Login</CardTitle>
      //     <CardDescription>Login to mymedicos dashboard</CardDescription>
      //   </CardHeader>
      //   <CardContent>
      //     <form>
      //       <div className="grid w-full items-center gap-4">
      //         <div className="flex flex-col space-y-1.5">
      //           <Label htmlFor="name">Email</Label>
      //           <Input id="name" name="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
      //         </div>
      //         <div className="flex flex-col space-y-1.5">
      //           <Label htmlFor="name">Password</Label>
      //           <Input id="password" name="password" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      //         </div>              
      //       </div>
      //     </form>
      //   </CardContent>
      //   <CardFooter className="flex justify-center">
      //     <Button onClick={SignMeIN}>Login</Button>
      //   </CardFooter>
      // </Card>
    )
  }

