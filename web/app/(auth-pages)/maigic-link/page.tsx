"use client";
// MagicLinkSignUp.js
import { FormEvent, useEffect, useState } from "react";
import { saveUserToDatabase } from "@/lib/SaveUserToDb";
import { supabase } from "@/components/SupabaseClient";
import { handleSignInOtp } from "@/components/sign_in_with_otp";

interface User {
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

const MagicLinkSignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();

    // Trigger Magic Link
    handleSignInOtp(email).then((error) => {
      if (error) {
        console.error("Error:", error);
        setMessage(`Error: ${error.message}`);
      } else {
        console.log("OTP sent successfully!");
        setMessage("Check your email for the magic link to sign in!");
      }
    });
  };

  console.log(name);

  useEffect(() => {
    // Check if there's already a user logged in
    const fetchUserSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const currentUser = data.session.user;
        setUser(currentUser as User);

        // Save user details to the database
        saveUserToDatabase({
          id: currentUser?.id,
          email: currentUser?.email!,
          name,
        });
      }

      // Listen for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session) {
            const signedInUser = session.user;
            setUser(signedInUser as User);
            console.log(event, signedInUser, "data");
            console.log(name);

            // Save user details to the database
            saveUserToDatabase({
              id: signedInUser?.id,
              email: signedInUser?.email!,
              name,
            });
          } else if (event === "SIGNED_OUT") {
            setUser(null);
          }
        }
      );

      // Clean up the listener on component unmount
      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    fetchUserSession();
  }, []);

  return (
    <>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="name"
          name="name"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adam Joseph"
          className="w-full px-4 py-2 bg-transparent border border-gray-500/25 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="m@example.com"
          className="w-full px-4 py-2 bg-transparent border border-gray-500/25 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-white text-black rounded-md"
        >
          Create account
        </button>
        {message && <p>{message}</p>}
      </form>
    </>
  );
};

export default MagicLinkSignUp;
