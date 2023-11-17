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
export function CardWithForm() {
    const {data} = useSession()
    console.log(data)
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
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
        <CardFooter className="flex justify-between">
          <Button onClick={()=>signIn("credentials", { username: username, password: password })}>Login</Button>
          <Button onClick={signOut}>LogOut</Button>
        </CardFooter>
      </Card>
    )
  }

