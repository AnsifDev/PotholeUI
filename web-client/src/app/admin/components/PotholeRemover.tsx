"use client"

import { removePothole } from "@/ports";
import { useState } from "react"

export function PotholeRemover() {
    const [ processing, setProcessing ] = useState(false);
    const [ place, setPlace ] = useState("")
    const [ notifications, setNotifications ] = useState<string[]>([])

    return (
        <div className="flex flex-col bg-white rounded-2xl p-8 gap-4 min-h-16 lg:self-start md:min-w-[480px]">
            <div className="material-symbols-rounded !text-[144px] text-center md:mt-12 mt-6">unpaved_road</div>
            <div className="text-center text-2xl font-bold mt-4">Remove Resolved Potholes</div>
            <div className="flex mt-8 gap-4">
                <div className="material-symbols-rounded !text-xl text-center self-center p-1">travel_explore</div>
                <input value={place} onChange={(e) => setPlace(e.target.value)} className="outline-none flex-1 min-w-0" placeholder="Place Name"/>
                <button onClick={() => {
                    setProcessing(true)
                    removePothole(place).then((value) => {
                        setProcessing(false)
                        setNotifications([...notifications, `${value} Pothole locactions on the name ${place} were removed`])
                        setTimeout(() => {
                            notifications.splice(notifications.length, 1)
                            setNotifications([ ...notifications ])
                        }, 3000)
                    })
                }} className="rounded-md bg-red-200 text-red-900 px-3 py-1.5">Delete</button>
            </div>
            <div hidden={!processing} className="flex gap-4 items-center justify-center bg-yellow-100 p-4 rounded-xl animate-pulse">
                {/* <div className="material-symbols-rounded">progress_activity</div> */}
                <div>Running Request...</div>
            </div>
            { notifications.map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-blue-50 p-4 rounded-xl">
                    <div className="flex-1 text-center">{item}</div>
                    <button onClick={() => {
                        notifications.splice(index, 1)
                        setNotifications([ ...notifications ])
                    }} className="material-symbols-rounded">close</button>
                </div>
            )) }
        </div>
    )
}