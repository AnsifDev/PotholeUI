"use client"

import { removeCompliant, verifyComplaint } from "@/ports"
import { Complaint } from "@/types"
import { useState } from "react"

export function ComplaintList({ complaints }: { complaints: Complaint[] }) {
    const [ complaintList, setComplaintList ] = useState(complaints)
    const [ notifications, setNotifications ] = useState<string[]>([])
    const [ loading, setLoading ] = useState(false)

    return (
        <div className="contents">
            {complaintList.length > 0? <div className="flex flex-col gap-4">
                {complaintList.map((item, index) => <ComplaintListItem complaint={item} key={index} onReject={() => {
                    complaintList.splice(index, 1)
                    setLoading(true)
                    removeCompliant(item).then(() => {
                        setLoading(false)
                        setNotifications([ ...notifications, `Complaint from ${item.name} is removed` ])
                    })
                    setComplaintList( [ ...complaintList ] )
                }} onAccept={(placeName) => {
                    complaintList.splice(index, 1)
                    setLoading(true)
                    verifyComplaint(item, placeName).then((newName) => {
                        setLoading(false)
                        setNotifications([ ...notifications, `Complaint from ${item.name} is added to pothole list in name ${newName}` ])
                    })
                    setComplaintList( [ ...complaintList ] )
                }}/>)}
            </div>: <div className="flex flex-1 flex-col items-center justify-center">
                <div className="text-xl italic font-bold">No Complaints</div>
            </div>}
            <div className="fixed bottom-12 sm:right-12 lg:right-18 left-8 right-8 flex flex-col items-center sm:items-end">
                <div className="flex flex-col gap-2 max-w-96 w-full">
                    { notifications.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center bg-blue-100 p-4 rounded-xl">
                            <div className="flex-1 text-center">{item}</div>
                            <button onClick={() => {
                                notifications.splice(index, 1)
                                setNotifications([ ...notifications ])
                            }} className="material-symbols-rounded">close</button>
                        </div>
                    )) }
                    <div hidden={!loading} className="flex gap-4 items-center bg-yellow-100 p-4 rounded-xl">
                        <div className="flex-1 text-center">Running Request...</div>
                    </div>
                </div>
                
            </div>
        </div>
        
    )
}

function ComplaintListItem({ complaint, onReject, onAccept }: { complaint: Complaint, onReject: () => void, onAccept: (placeName: string) => void }) {
    const [ confirmDialogShown, setConfirmDialogShown ] = useState(false)
    const [ place, setPlace ] = useState("")

    return(
        <div className={`bg-amber-100 rounded-xl flex flex-col overflow-clip relative ${confirmDialogShown? 'min-h-64': ''}`}>
            <div className="flex flex-col p-6 gap-2">
                <div className="text-md font-bold text-sm">{complaint.name}</div>
                <div>{complaint.complaint}</div>
                <div className="flex flex-row-reverse gap-2 mt-1">
                    <button onClick={() => setConfirmDialogShown(true)} className="rounded-full px-6 py-1.5 bg-purple-200">Accept</button>
                    <button onClick={() => onReject()} className="rounded-full px-6 py-1.5 border">Reject</button>
                </div>
            </div>
            <button onClick={() => {
                window.open(`https://google.com/maps?q=${complaint.latitude},${complaint.longitude}`)
            }} className="absolute flex top-4 right-4 text-sm italic px-4 py-0.5 border rounded hover:bg-purple-50/60 gap-4">
                <div>Location Annotated: {complaint.latitude}, {complaint.longitude}</div>
                <div className="material-symbols-rounded !text-sm">open_in_new</div>
            </button>
            <div hidden={!confirmDialogShown} className="w-full h-full backdrop-blur-sm flex flex-col p-6 gap-2 absolute justify-center">
                <button onClick={() => setConfirmDialogShown(false)} className="material-symbols-rounded absolute top-6 left-6 p-1.5 rounded-md hover:bg-amber-50/50 backdrop-blur-lg">arrow_back_ios_new</button>
                <div className="material-symbols-rounded !text-[64px] text-center">add_location_alt</div>
                <div className="flex flex-col gap-1 items-stretch mt-4">
                    <div className="text-xs ml-2">Place Name</div>
                    <input value={place} onChange={(e) => setPlace(e.target.value)} type="text" className="outline-none bg-amber-50/80 backdrop-blur-lg py-1 px-2 rounded-md"/>
                </div>
                <button onClick={() => {
                    setConfirmDialogShown(false)
                    onAccept(place)
                }} className="rounded-full px-6 py-1.5 bg-purple-200/80 backdrop-blur-lg mt-4 max-w-96 w-full self-center">Confirm</button>
            </div>
        </div>
    )
}