import { supabase } from "./SupabaseClient";


export const handleSignInOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // set this to false if you do not want the user to be automatically signed up
            shouldCreateUser: false,
            emailRedirectTo: "https://meet.authcast.com",
          },
      });

      return error
}