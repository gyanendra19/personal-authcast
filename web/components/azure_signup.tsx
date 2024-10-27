// MicrosoftAuth.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/components/SupabaseClient";
import { saveUserToDatabase } from "@/lib/SaveUserToDb";
import Image from "next/image";

interface User {
  id: string
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

const MicrosoftAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  // Handle Microsoft sign-in
  const handleMicrosoftSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure", // Use "azure" for Microsoft sign-in in Supabase
      });

      if (error) {
        console.error("Error signing in with Microsoft:", error.message);
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Unexpected error during Microsoft sign-in:", error);
      setMessage(`Unexpected error: ${error}`);
    }
  };

  useEffect(() => {
    // Check if there's already a user logged in
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const currentUser = data.session.user;
          setUser(currentUser as User);
        }

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === "SIGNED_IN" && session) {
              const signedInUser = session.user;
              setUser(signedInUser as User);

              // Save user details to the database (if needed)
              try {
                await saveUserToDatabase({
                  id: signedInUser.id,
                  email: signedInUser.email!,
                  name: signedInUser.user_metadata?.full_name,
                });
              } catch (dbError) {
                console.error("Error saving user to the database:", dbError);
              }
            } else if (event === "SIGNED_OUT") {
              setUser(null);
            }
          }
        );

        // Clean up the listener on component unmount
        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching session:", error);
        setMessage(`Error fetching session: ${error}`);
      }
    })();
  }, []);

  return (
    <button onClick={handleMicrosoftSignIn} className="flex items-center px-8 py-1 space-x-2 border border-gray-400/35 text-white rounded-md">
    <Image width={22} height={22} alt="" src='/microsoft.png' />
    <span className="text-sm">Microsoft</span>
  </button>
  );
};

export default MicrosoftAuth;
