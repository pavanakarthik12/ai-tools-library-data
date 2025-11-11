import { createClient } from "@supabase/supabase-js";

// Safely retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are missing
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase environment variables are missing. Check your .env or Vercel Environment Settings.");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✅ Found" : "❌ Missing");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseKey ? "✅ Found" : "❌ Missing");
}

// Create Supabase client with fallback to prevent app crash
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Fallback object to prevent app crashes
      from: () => ({ select: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }) }),
      // Add other methods as needed with fallback implementations
    };