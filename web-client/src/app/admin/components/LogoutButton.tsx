"use client"

import { logout } from "@/ports"
import { useRouter } from "next/navigation"

export function LogoutButton() {
    const router = useRouter()

    return <button onClick={() => {
        logout()
        router.push("/")
    }} className="material-symbols-rounded hover:bg-purple-100 rounded px-2 py-2 my-4">logout</button>
}