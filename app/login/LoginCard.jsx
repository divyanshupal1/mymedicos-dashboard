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
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
export function CardWithForm() {
    const router = useRouter()
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    function SignMeIN(){
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username:username, password:password }),
      }).then((res) => res.json()).then((data)=>{
        if(data.success) {
          router.push("/dashboard/publications")
        }
      })
    }




    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to mymedicos dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input id="name" name="username" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              </div>              
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={SignMeIN}>Login</Button>
        </CardFooter>
      </Card>
    )
  }

