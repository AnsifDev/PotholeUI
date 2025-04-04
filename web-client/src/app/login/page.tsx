import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginPage } from "./LoginPage";

export default async function Home() {
  const mcookies = await cookies()
  if (mcookies.has("username")) redirect("/admin")
  console.log("Running")
  return (
    <div className="flex flex-col sm:items-center sm:justify-center bg-green-100 min-h-dvh text-black">
      <LoginPage />
    </div>
  );
}