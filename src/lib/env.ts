export const publicEnv = {
  supabaseProjectId:
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID ??
    process.env.VITE_SUPABASE_PROJECT_ID ??
    "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    "",
  supabaseUrl:
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    "",
};