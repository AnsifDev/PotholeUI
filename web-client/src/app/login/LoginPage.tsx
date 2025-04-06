"use client"

import { authenticate } from "@/ports"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginPage() {
    const router = useRouter()
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    return (
        <form onSubmit={(e) => {
          e.preventDefault()

          setLoading(true)
          setError(false)
          authenticate(username, password).then((success) => {
            setLoading(false)
            if (success) router.push("/admin")
            else setError(true)
          })
        }} className="md:w-[540px] min-h-[540px] w-full flex-1 md:flex-none md:h-auto overflow-auto sm:rounded-2xl bg-white shadow-2xl flex flex-col sm:px-8 px-4 sm:py-4 py-2">
          <div className="material-symbols-rounded !text-[144px] text-center md:mt-12 mt-32">admin_panel_settings</div>
          <div className="text-center text-2xl font-bold mt-4">Admin Login</div>
          <div className="flex flex-col gap-1 items-stretch mt-8">
            <div className="text-xs ml-2">Username</div>
            <input 
              required 
              type="text"
              name="username"
              autoComplete="username" 
              placeholder="Enter the username"
              value={username} onChange={(e) => setUsername(e.target.value)} 
              className="outline-none bg-purple-50 py-1 px-2 rounded"/>
          </div>
          <div className="flex flex-col gap-1 items-stretch mt-2">
            <div className="text-xs ml-2">Password</div>
            <input 
              required 
              type="password" 
              name="password"
              autoComplete="current-password"
              placeholder="Enter the password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="outline-none bg-purple-50 py-1 px-2 rounded"/>
          </div>
          <div hidden={!error} className="flex flex-row justify-center p-2 rounded-lg bg-red-100 mt-8 gap-4 text-red-900">
            <div className="material-symbols-rounded">error</div>
            <div className="font-bold">Invalid Credentials</div>
          </div>
          <button type="submit" disabled={loading} className="self-center rounded-full px-32 py-2 bg-purple-100 mt-8">{loading? "Signing In...": "Sign In"}</button>
      </form>
    )
}