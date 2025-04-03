"use client"

import { submitCompliant } from "@/port";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [ name, setName ] = useState("")
  const [ lat, setLat ] = useState("")
  const [ lon, setLon ] = useState("")
  const [ complaint, setComplaint ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ locationAvailable, setLocationAvailable ] = useState(false)
  const [ success, setSuccess ] = useState(false)

  useEffect(() => {
    setLocationAvailable(navigator.geolocation != null)
  }, [])

  return (
    <div className="flex flex-col sm:items-center sm:justify-center bg-blue-100 min-h-dvh text-black gap-4">
      <div className="md:w-[720px] lg:w-[960px] w-full flex-1 md:flex-none md:h-auto overflow-auto sm:rounded-2xl bg-white shadow-2xl flex flex-col sm:px-8 px-4 sm:py-4 py-2">
        <div className="sm:text-[48px] text-[36px] font-bold text-black text-center sm:mt-4 mt-16 italic">Report Pothole</div>
        <div className="flex-1 flex flex-col gap-4 mt-8">
          <div className="flex flex-col lg:flex-row lg:gap-8 gap-4 mt-8 sm:mt-0">
            <div className="flex-1 flex flex-col gap-1 items-stretch">
              <div className="text-xs ml-2">Your Name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} className="outline-none bg-blue-50 py-1 px-2 rounded"/>
            </div>
            <div className="flex-1 flex flex-col gap-1 items-stretch">
              <div className="text-xs ml-2">Location</div>
              <div className="flex gap-2 items-start">
                <input value={lat} onChange={(e) => setLat(e.target.value)} className="flex-1 outline-none bg-blue-50 py-1 px-2 rounded min-w-0" placeholder="Lat"/>
                <input value={lon} onChange={(e) => setLon(e.target.value)} className="flex-1 outline-none bg-blue-50 py-1 px-2 rounded min-w-0" placeholder="Lon"/>
                <button hidden={!locationAvailable} onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLat(position.coords.latitude.toString())
                      setLon(position.coords.longitude.toString())
                    },
                    (error) => {
                      console.error(error.message);
                    }
                  );
                }} className="material-symbols-rounded px-2 py-1 rounded !text-base hover:bg-blue-50">my_location</button>
              </div>
            </div>
            
          </div>
          <div className="flex flex-col gap-1 items-stretch">
            <div className="text-xs ml-2">Complaint</div>
            <textarea value={complaint} onChange={(e) => setComplaint(e.target.value)} className="outline-none bg-blue-50 py-1 px-2 rounded-md min-h-32"/>
          </div>
          <div hidden={!success} className="flex flex-row p-4 rounded-lg bg-green-100">
            <div className="ml-12 text-center flex-1">Complaint submitted sucessfully</div>
            <div className="material-symbols-rounded">close</div>
          </div>
          <button onClick={() => {
            setLoading(true)
            submitCompliant(name, Number.parseFloat(lat), Number.parseFloat(lon), complaint).then(() => {
              setLoading(false)
              setName("")
              setLat("")
              setLon("")
              setComplaint("")
              setSuccess(true)
            })
          }} className="self-center rounded-full px-32 py-2 bg-blue-100">{loading? "Submitting": "Submit"}</button>
        </div>
        {/* <div className="flex flex-row sm:my-8 my-4 min-h-13 gap-4 pl-4 pr-1.5 py-1.5 bg-blue-50 rounded-lg">
          <div className="text-sm flex-1 self-center">By submitting the complaint, we actually </div>
          <Link href={"/nodes/create"} className="text-nowrap bg-white py-1 px-6 flex items-center rounded-md">Agree & Submit</Link>
        </div> */}
        <div className="text-wrap text-center text-sm text-neutral-500 flex items-center justify-center gap-1 mt-16">
          <div>Complaints Portal</div>
          <div>&bull;</div>
          <div className="hidden sm:block">Pothole Detection Platform</div>
          <div className="hidden sm:block">&bull;</div>
          <Link href={"/login"} className="text-blue-600">Login As Admin</Link>
        </div>
      </div>
    </div>
  );
}
