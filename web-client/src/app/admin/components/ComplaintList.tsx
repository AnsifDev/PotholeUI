"use client"

import { removeCompliant, verifyPothole } from "@/port"
import { useState } from "react"

export function ComplaintList({ complaints }: { complaints: string[] }) {
    const [ complaintList, setComplaintList ] = useState(complaints)

    return (
        complaintList.length > 0? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {complaintList.map((item) => <ComplaintListItem key={item} onReject={() => {
                complaintList.splice(0, 1)
                removeCompliant()
                setComplaintList( [ ...complaintList ] )
            }} onAccept={() => {
                complaintList.splice(0, 1)
                verifyPothole()
                setComplaintList( [ ...complaintList ] )
            }}/>)}
        </div>: <div className="flex flex-1 flex-col items-center justify-center">
            <div className="text-xl italic font-bold">No Complaints</div>
        </div>
    )
}

function ComplaintListItem({ onReject, onAccept }: { onReject: () => void, onAccept: (placeName: string) => void }) {
    const [ confirmDialogShown, setConfirmDialogShown ] = useState(false)
    return(
        <div className="min-h-48 bg-amber-100 rounded-xl flex flex-col overflow-clip relative">
            <div className="flex flex-col p-6 gap-2">
                <div className="text-md font-bold text-sm">Name</div>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus metus eget eros euismod porta sed ut arcu. Nam semper tempor finibus. Suspendisse mollis ligula eu libero dignissim, nec aliquet nunc blandit. Vivamus tempus ullamcorper purus, eu cursus magna dapibus eget. Maecenas ut elit vitae velit volutpat lobortis. Integer sodales eleifend leo ut aliquam. Praesent consequat accumsan augue, id interdum ex semper consequat. Maecenas vel pharetra nunc.</div>
                <div className="flex flex-row-reverse gap-2 mt-1">
                    <button onClick={() => setConfirmDialogShown(true)} className="rounded-full px-6 py-1.5 bg-blue-200">Accept</button>
                    <button onClick={() => onReject()} className="rounded-full px-6 py-1.5 border">Reject</button>
                </div>
            </div>
            <div hidden={!confirmDialogShown} className="w-full h-full backdrop-blur-sm flex flex-col p-6 gap-2 absolute justify-center">
                <button onClick={() => setConfirmDialogShown(false)} className="material-symbols-rounded absolute top-6 left-6 p-1.5 rounded-md hover:bg-amber-50/50 backdrop-blur-lg">arrow_back_ios_new</button>
                <div className="material-symbols-rounded !text-[64px] text-center">add_location_alt</div>
                <div className="flex flex-col gap-1 items-stretch mt-4">
                    <div className="text-xs ml-2">Place Name</div>
                    <input type="text" className="outline-none bg-amber-50/80 backdrop-blur-lg py-1 px-2 rounded-md"/>
                </div>
                <button onClick={() => {
                    setConfirmDialogShown(false)
                    onAccept("")
                }} className="rounded-full px-6 py-1.5 bg-blue-200/80 backdrop-blur-lg mt-4 max-w-96 w-full self-center">Confirm</button>
            </div>
        </div>
    )
}