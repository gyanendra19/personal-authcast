'use client'
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import MagicLinkSignUp from "./(auth-pages)/maigic-link/page";
import MicrosoftAuth from "@/components/azure_signup";
import { supabase } from "@/components/SupabaseClient";

export default function Index() {
  const [session, setSession] = useState<string | null >(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const fetchUserSession = async () => {
      setLoading(true)
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log(data.session, "shs");
        setSession(data.session.access_token)
      }
      setLoading(false)
    };

    fetchUserSession();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      setSession(null); // Clear the session state
    }
  };

  if(loading) {
    return (
    <p>Loading...</p>
  )
}
console.log(loading);


  return (
    <>
    {session ? (
      <div>
        <p>You are logged in</p>
        <button onClick={handleSignOut}>
        Logout
      </button>
      </div>
    ) : (
    <div className="flex justify-center w-full items-center min-h-screen ">
      <div className="w-[30%] px-6 py-10 flex flex-col gap-6 rounded-xl shadow-md border border-gray-200/25">
        <div>
          <h2 className="text-2xl font-bold text-white">Create an account</h2>
          <p className="text-gray-400">
            Enter your email below to create your account
          </p>
        </div>

        <div className="flex space-x-4 justify-center">
          <MicrosoftAuth />
        </div>

        <div className="text-center text-sm text-gray-500">
          OR CONTINUE WITH
        </div>
        <MagicLinkSignUp />
      </div>
    </div>
    )}
    </>
  );
}
