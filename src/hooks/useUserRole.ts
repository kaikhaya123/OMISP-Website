import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Normalized role is always "founder" | "investor" | null
// The DB stores "founder" or "investor"; we never store "vc" in the DB
export type AppRole = "founder" | "investor" | null;

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole>(null);
  const [loading, setLoading] = useState(true);
  const fetchedForUser = useRef<string | null>(null);

  useEffect(() => {
    // Wait until auth is resolved
    if (authLoading) return;

    if (!user) {
      setRole(null);
      setLoading(false);
      fetchedForUser.current = null;
      return;
    }

    // Avoid re-fetching for the same user
    if (fetchedForUser.current === user.id) return;

    const fetchRole = async () => {
      setLoading(true);
      fetchedForUser.current = user.id;

      const { data, error } = await (supabase.from("profiles") as any)
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("[useUserRole] Error fetching role:", error.message);
        setRole(null);
        setLoading(false);
        return;
      }

      if (data?.role) {
        // Normalize: "vc" → "investor" in case old data exists
        const normalized: AppRole =
          data.role === "vc" ? "investor" :
          data.role === "investor" ? "investor" :
          data.role === "founder" ? "founder" : null;
        setRole(normalized);
        setLoading(false);
        return;
      }

      // No profile row yet — check user_metadata from signup
      const metaRole = user.user_metadata?.role;
      if (metaRole === "investor" || metaRole === "vc" || metaRole === "founder") {
        const normalized: AppRole = (metaRole === "vc" || metaRole === "investor") ? "investor" : "founder";
        // Persist it so future logins don't re-ask
        await (supabase.from("profiles") as any).upsert(
          {
            id: user.id,
            role: normalized,
            full_name: user.user_metadata?.full_name ?? null,
          },
          { onConflict: "id" }
        );
        setRole(normalized);
      } else {
        // Genuinely no role yet — need to choose
        setRole(null);
      }

      setLoading(false);
    };

    fetchRole();
  }, [user, authLoading]);

  return {
    role,
    loading,
    isVC: role === "investor",
    isFounder: role === "founder",
  };
}
