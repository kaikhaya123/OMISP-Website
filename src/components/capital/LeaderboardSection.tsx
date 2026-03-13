import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy, Zap, TrendingUp, DollarSign, Users,
  ChevronRight, Crown,
} from "lucide-react";

interface FounderRow {
  id: string;
  full_name: string | null;
  company_name: string | null;
  industry_experience: string | null;
  current_mrr: number | null;
  team_size: number | null;
  monthly_growth_rate: number | null;
  avatar_url: string | null;
  total_score: number;
  progress_velocity: number | null;
  is_vc_eligible: boolean;
}

interface LeaderboardSectionProps {
  founders: FounderRow[];
  loading: boolean;
}

type RankMode = "score" | "velocity";

const AVATAR_FALLBACK = "https://api.dicebear.com/7.x/initials/svg?seed=";

function isUnicorn(f: FounderRow) {
  return (f.total_score ?? 0) >= 60 && (f.team_size ?? 0) >= 3 && (f.current_mrr ?? 0) > 0;
}

function fmtMrr(v: number | null) {
  if (!v) return "$0";
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

const MEDALS = [
  { bg: "bg-yellow-400/20", text: "text-yellow-500", border: "border-yellow-400/40", label: "🥇" },
  { bg: "bg-muted",         text: "text-muted-foreground", border: "border-border", label: "🥈" },
  { bg: "bg-amber-700/10",  text: "text-amber-600",  border: "border-amber-600/30", label: "🥉" },
];

export default function LeaderboardSection({ founders, loading }: LeaderboardSectionProps) {
  const [mode, setMode] = useState<RankMode>("score");

  const ranked = [...founders]
    .filter(f => mode === "score" ? f.total_score > 0 : (f.progress_velocity ?? 0) > 0)
    .sort((a, b) =>
      mode === "score"
        ? b.total_score - a.total_score
        : (b.progress_velocity ?? 0) - (a.progress_velocity ?? 0)
    )
    .slice(0, 10);

  return (
    <div className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Top Founders</h2>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setMode("score")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === "score"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="w-3 h-3" /> OMISP Score
          </button>
          <button
            onClick={() => setMode("velocity")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === "velocity"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="w-3 h-3" /> Velocity
          </button>
        </div>
      </div>

      {/* Podium — top 3 */}
      {!loading && ranked.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* 2nd */}
          <div className="flex flex-col items-center pt-6">
            <PodiumCard founder={ranked[1]} rank={2} mode={mode} medal={MEDALS[1]} />
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center">
            <PodiumCard founder={ranked[0]} rank={1} mode={mode} medal={MEDALS[0]} highlighted />
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center pt-10">
            <PodiumCard founder={ranked[2]} rank={3} mode={mode} medal={MEDALS[2]} />
          </div>
        </div>
      )}

      {/* Rows 4–10 */}
      {!loading && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {ranked.slice(3).map((f, i) => {
            const rank = i + 4;
            const unicorn = isUnicorn(f);
            const value = mode === "score"
              ? Math.round(f.total_score)
              : Math.round(f.progress_velocity ?? 0);
            const avatarUrl = f.avatar_url ?? `${AVATAR_FALLBACK}${encodeURIComponent(f.full_name ?? "F")}`;

            return (
              <Link
                key={f.id}
                to={`/capital/founder/${f.id}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors group"
              >
                {/* Rank */}
                <span className="w-6 text-center text-sm font-bold text-muted-foreground">{rank}</span>

                {/* Avatar */}
                <img
                  src={avatarUrl}
                  alt={f.full_name ?? ""}
                  className="w-8 h-8 rounded-full object-cover bg-muted shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground truncate">
                      {f.full_name ?? "—"}
                    </span>
                    {unicorn && <span className="text-xs">🦄</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{f.company_name ?? "—"}</span>
                    {f.industry_experience && (
                      <span className="hidden sm:inline text-muted-foreground/60">· {f.industry_experience}</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />{fmtMrr(f.current_mrr)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />{f.team_size ?? "—"}
                  </span>
                </div>

                {/* Score/velocity value */}
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold text-primary">{value}</p>
                  <p className="text-xs text-muted-foreground">{mode === "score" ? "pts" : "vel"}</p>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
              </Link>
            );
          })}

          {ranked.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No founders ranked yet.
            </div>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Podium card ──────────────────────────────────────────────────────────────
function PodiumCard({
  founder, rank, mode, medal, highlighted = false,
}: {
  founder: FounderRow;
  rank: number;
  mode: RankMode;
  medal: { bg: string; text: string; border: string; label: string };
  highlighted?: boolean;
}) {
  const unicorn = isUnicorn(founder);
  const value = mode === "score"
    ? Math.round(founder.total_score)
    : Math.round(founder.progress_velocity ?? 0);
  const avatarUrl = founder.avatar_url ?? `${AVATAR_FALLBACK}${encodeURIComponent(founder.full_name ?? "F")}`;

  return (
    <Link
      to={`/capital/founder/${founder.id}`}
      className={`flex flex-col items-center p-3 rounded-xl border transition-all hover:scale-105 w-full text-center ${
        highlighted
          ? "border-primary/40 bg-gradient-to-b from-primary/10 to-card shadow-md"
          : `${medal.border} bg-card`
      }`}
    >
      {/* Rank medal */}
      <span className="text-xl mb-2">{medal.label}</span>

      {/* Avatar */}
      <div className="relative mb-2">
        <img
          src={avatarUrl}
          alt={founder.full_name ?? ""}
          className={`rounded-full object-cover bg-muted ${highlighted ? "w-14 h-14" : "w-11 h-11"}`}
        />
        {unicorn && (
          <span className="absolute -top-1 -right-1 text-sm">🦄</span>
        )}
      </div>

      {/* Name */}
      <p className="text-xs font-semibold text-foreground truncate w-full px-1">
        {founder.full_name ?? "—"}
      </p>
      <p className="text-xs text-muted-foreground truncate w-full px-1 mb-2">
        {founder.company_name ?? "—"}
      </p>

      {/* Score */}
      <div className={`rounded-lg px-3 py-1 ${medal.bg} border ${medal.border}`}>
        <span className={`text-base font-bold ${highlighted ? "text-primary" : medal.text}`}>{value}</span>
        <span className={`text-xs ml-0.5 ${medal.text}`}>{mode === "score" ? "pts" : "vel"}</span>
      </div>

      {founder.is_vc_eligible && (
        <Badge className="mt-1.5 text-xs bg-primary/10 text-primary border-primary/20 border px-1.5 py-0">
          VC Eligible
        </Badge>
      )}
    </Link>
  );
}
