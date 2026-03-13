import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface ScoreData {
  dimension: string;
  score: number;
  fullMark: number;
}

interface ScoreRadarProps {
  scores: {
    execution: number;
    market: number;
    team: number;
    product: number;
    traction: number;
    pitch: number;
  };
}

const ScoreRadar = ({ scores }: ScoreRadarProps) => {
  const data: ScoreData[] = [
    { dimension: "Execution", score: scores.execution, fullMark: 100 },
    { dimension: "Market", score: scores.market, fullMark: 100 },
    { dimension: "Team", score: scores.team, fullMark: 100 },
    { dimension: "Product", score: scores.product, fullMark: 100 },
    { dimension: "Traction", score: scores.traction, fullMark: 100 },
    { dimension: "Pitch", score: scores.pitch, fullMark: 100 },
  ];

  const avgScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
  );

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Founder Score</span>
          <span className="text-3xl font-bold text-primary">{avgScore}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="dimension" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.dimension} className="text-center p-2 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">{item.dimension}</p>
              <p className="text-lg font-semibold">{item.score}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreRadar;
