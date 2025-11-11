// Pre-build environment variable check script
console.log("🔍 Checking Supabase environment variables...");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let hasMissingVars = false;

if (!supabaseUrl) {
  console.warn("⚠️  VITE_SUPABASE_URL is missing");
  hasMissingVars = true;
}

if (!supabaseKey) {
  console.warn("⚠️  VITE_SUPABASE_ANON_KEY is missing");
  hasMissingVars = true;
}

if (hasMissingVars) {
  console.warn("⚠️ Missing Supabase environment variables. App may fail on deploy.");
  console.warn("Please ensure these are set in your .env file or Vercel Environment Settings.");
} else {
  console.log("✅ All Supabase environment variables are present");
}

// Exit with success code even if vars are missing to allow build to continue
process.exit(0);