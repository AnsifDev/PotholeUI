import { ComplaintList } from "./components/ComplaintList";
import { Suspense } from "react";
import { PotholeRemover } from "./components/PotholeRemover";
import { LogoutButton } from "./components/LogoutButton";
import { getCompliants } from "@/port";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function ComplaintListItemSkel() {
    return (
        <div className="min-h-48 bg-amber-100 rounded-xl flex flex-col p-6 gap-2 animate-pulse">
            <div className="h-7 w-96 rounded-lg bg-amber-50"/>
            <div className="h-6 w-full rounded-lg bg-amber-50 mt-2"/>
            <div className="h-6 w-full rounded-lg bg-amber-50"/>
            <div className="h-6 w-64 rounded-lg bg-amber-50"/>
        </div>
    )
}

function ComplaintListSkel() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <ComplaintListItemSkel />
            <ComplaintListItemSkel />
            <ComplaintListItemSkel />
        </div>
    )
}

async function ComplaintListLoader() {
    const complaints = await getCompliants()

    return <ComplaintList complaints={complaints} />
}

export default async function Page() {
    const mcookies = await cookies()
    if (!mcookies.has("username")) redirect("/login")

    return (
        <div className="min-h-dvh bg-green-50 text-black flex flex-col">
            <header className="flex px-6 items-start">
                <div className="text-2xl font-bold py-2 flex-1 text-center ml-12 mt-8 mb-6">Admin Portal</div>
                {/* <div className="flex-1"/> */}
                <LogoutButton />
            </header>
            <main className="flex-1 mb-4 flex flex-col lg:flex-row min-h-96 max-w-[1680px] w-full self-center gap-4 px-4">
                <div className="flex flex-1 flex-col bg-white rounded-2xl p-8 gap-4">
                    <div className="text-neutral-600 ml-2">Complaints</div>
                    <Suspense fallback={<ComplaintListSkel />}>
                        <ComplaintListLoader />
                    </Suspense>
                </div>
                <PotholeRemover />
            </main>
        </div>
    )
}