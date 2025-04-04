"use server"

import { cookies } from "next/headers"
import { setTimeout } from "timers/promises"

export async function getCompliants() {
    await setTimeout(3000)

    return [
        "temp1",
        "temp2",
        "temp3"
    ] 
}

export async function verifyPothole() {
    await setTimeout(3000)
}

export async function removeCompliant() {
    await setTimeout(3000)
}

export async function removePothole(placeName: string) {
    await setTimeout(3000)

    return `Documents on ${placeName} Deleted`
}

export async function authenticate(username: string, password: string) {
    await setTimeout(3000)

    const success = (username == "user1" && password == "password")
    const mcookies = await cookies()
    if (success) 
        mcookies.set("username", username)

    return success
}

export async function logout() {
    const mcookies = await cookies()
    mcookies.delete("username")
}

export async function submitCompliant(name: string, latitude: number, longitude: number, complaint: string) {
    await setTimeout(3000)

    return `${name} ${latitude} ${longitude} ${complaint}`
}