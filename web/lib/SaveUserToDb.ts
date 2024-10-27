import { supabase } from "@/components/SupabaseClient";

// utils/saveUserToDatabase.ts

// Define the user details interface
interface UserDetails {
  id: string
  email: string;
  name?: string;
  //   created_at?: string;
  //   domain?: string;
}

// Function to save user details to the database
export const saveUserToDatabase = async (user: UserDetails) => {
  const { id, email, name } = user;

  const { data, error } = await supabase.from("users").upsert(
    [
      // Use upsert to insert or update if the email already exists
      {
        id,
        name,
        email,
        created_at: new Date().toISOString(),
        domain: "",
      },
    ],
    { onConflict: "email" } // Ensure we update if the email exists
  );

  if (error) {
    console.error("Error saving user to the database:", error.message);
    return false;
  }

  return data;
};
