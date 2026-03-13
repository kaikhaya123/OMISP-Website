import { useState } from "react";
import { ArrowLeft, Plus, Download, TrendingUp, DollarSign, Users, Package, Trash2, Sparkles, Loader2, Brain, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { publicEnv } from "@/lib/env";

interface RevenueStream {
  id: string;
  name: string;
  type: "subscription" | "one-time" | "usage";
  price: number;
  customersMonth1: number;
  growthRate: number;
  churnRate: number;
}

interface AIAnalysis {
  healthScore: number;
  analysis: {
    summary: string;
    strengths: string[];
    risks: string[];
    benchmarks: {
      churnVsIndustry: string;
      growthVsIndustry: string;
      burnRateAssessment: string;
    };
  };
  recommendations: {
    title: string;
    description: string;
    impact: string;
    effort: string;
  }[];
  optimizedProjections: {
    year1ARR: number;
    year2ARR: number;
    monthsToBreakeven: number;
    suggestedPriceChange: string | null;
  };
}

const RevenueArchitect = () => {
  const { toast } = useToast();
  const [streams, setStreams] = useState<RevenueStream[]>([
    { id: "1", name: "Pro Plan", type: "subscription", price: 49, customersMonth1: 100, growthRate: 15, churnRate: 5 },
  ]);
  const [expenses, setExpenses] = useState({
    salaries: 15000,
    marketing: 5000,
    infrastructure: 2000,
    other: 1000,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const addStream = () => {
    setStreams([
      ...streams,
      {
        id: Date.now().toString(),
        name: "New Stream",
        type: "subscription",
        price: 29,
        customersMonth1: 50,
        growthRate: 10,
        churnRate: 5,
      },
    ]);
  };

  const removeStream = (id: string) => {
    setStreams(streams.filter((s) => s.id !== id));
  };

  const updateStream = (id: string, field: keyof RevenueStream, value: any) => {
    setStreams(streams.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const generateProjections = () => {
    const months = [];
    for (let i = 0; i < 36; i++) {
      let monthlyRevenue = 0;
      let totalCustomers = 0;

      streams.forEach((stream) => {
        const customers = Math.round(
          stream.customersMonth1 * Math.pow(1 + stream.growthRate / 100 - stream.churnRate / 100, i)
        );
        totalCustomers += customers;
        monthlyRevenue += customers * stream.price;
      });

      const totalExpenses = expenses.salaries + expenses.marketing + expenses.infrastructure + expenses.other;
      const expenseGrowth = Math.pow(1.02, Math.floor(i / 12));

      months.push({
        month: `M${i + 1}`,
        revenue: monthlyRevenue,
        expenses: Math.round(totalExpenses * expenseGrowth),
        profit: monthlyRevenue - Math.round(totalExpenses * expenseGrowth),
        customers: totalCustomers,
        arr: monthlyRevenue * 12,
      });
    }
    return months;
  };

  const projections = generateProjections();
  const currentMetrics = projections[11] || projections[0];
  const year2Metrics = projections[23] || projections[0];
  const year3Metrics = projections[35] || projections[0];

  const avgPrice = streams.reduce((acc, s) => acc + s.price, 0) / streams.length || 0;
  const avgChurn = streams.reduce((acc, s) => acc + s.churnRate, 0) / streams.length || 5;
  const ltv = avgChurn > 0 ? (avgPrice / (avgChurn / 100)) : avgPrice * 12;
  const cac = expenses.marketing / (streams.reduce((acc, s) => acc + s.customersMonth1, 0) || 1);
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/revenue-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: JSON.stringify({ streams, expenses }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const analysis = await response.json();
      setAiAnalysis(analysis);
      toast({
        title: "Analysis complete!",
        description: "AI has analyzed your financial model.",
      });
    } catch (error) {
      console.error("AI analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                AI Revenue Architect
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                  <Brain className="w-3 h-3 mr-1" />
                  Smart Modeling
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">Build investor-ready financial models with AI insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={runAIAnalysis} 
              disabled={isAnalyzing}
              className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isAnalyzing ? "Analyzing..." : "AI Analysis"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* AI Insights Banner */}
        {aiAnalysis && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  AI Financial Health Score
                </CardTitle>
                <div className={`text-4xl font-bold ${
                  aiAnalysis.healthScore >= 70 ? "text-green-500" : 
                  aiAnalysis.healthScore >= 50 ? "text-yellow-500" : "text-red-500"
                }`}>
                  {aiAnalysis.healthScore}/100
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{aiAnalysis.analysis.summary}</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Strengths
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {aiAnalysis.analysis.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Risks
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {aiAnalysis.analysis.risks.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Top Recommendation
                  </h4>
                  {aiAnalysis.recommendations[0] && (
                    <div className="text-sm">
                      <p className="font-medium">{aiAnalysis.recommendations[0].title}</p>
                      <p className="text-muted-foreground">{aiAnalysis.recommendations[0].description}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="projections">Projections</TabsTrigger>
            <TabsTrigger value="unit-economics">Unit Econ</TabsTrigger>
          </TabsList>

          {/* Revenue Streams Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Revenue Streams</h2>
              <Button onClick={addStream} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Stream
              </Button>
            </div>

            <div className="grid gap-4">
              {streams.map((stream) => (
                <Card key={stream.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label>Stream Name</Label>
                        <Input
                          value={stream.name}
                          onChange={(e) => updateStream(stream.id, "name", e.target.value)}
                          placeholder="e.g., Pro Plan"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={stream.type}
                          onValueChange={(v) => updateStream(stream.id, "type", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="subscription">Subscription</SelectItem>
                            <SelectItem value="one-time">One-time</SelectItem>
                            <SelectItem value="usage">Usage-based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          value={stream.price}
                          onChange={(e) => updateStream(stream.id, "price", Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Initial Customers</Label>
                        <Input
                          type="number"
                          value={stream.customersMonth1}
                          onChange={(e) => updateStream(stream.id, "customersMonth1", Number(e.target.value))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>Growth %</Label>
                          <Input
                            type="number"
                            value={stream.growthRate}
                            onChange={(e) => updateStream(stream.id, "growthRate", Number(e.target.value))}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-6 text-destructive"
                          onClick={() => removeStream(stream.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label>Monthly Churn Rate (%)</Label>
                        <Input
                          type="number"
                          value={stream.churnRate}
                          onChange={(e) => updateStream(stream.id, "churnRate", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <h2 className="text-lg font-semibold">Monthly Expenses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Salaries & Contractors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    value={expenses.salaries}
                    onChange={(e) => setExpenses({ ...expenses, salaries: Number(e.target.value) })}
                    className="text-lg"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Marketing & Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    value={expenses.marketing}
                    onChange={(e) => setExpenses({ ...expenses, marketing: Number(e.target.value) })}
                    className="text-lg"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Infrastructure & Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    value={expenses.infrastructure}
                    onChange={(e) => setExpenses({ ...expenses, infrastructure: Number(e.target.value) })}
                    className="text-lg"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Other Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="number"
                    value={expenses.other}
                    onChange={(e) => setExpenses({ ...expenses, other: Number(e.target.value) })}
                    className="text-lg"
                  />
                </CardContent>
              </Card>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Monthly Expenses</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(expenses.salaries + expenses.marketing + expenses.infrastructure + expenses.other).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardHeader className="pb-2">
                  <CardDescription>Year 1 ARR</CardDescription>
                  <CardTitle className="text-2xl text-green-600">${currentMetrics.arr.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{currentMetrics.customers} customers</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardHeader className="pb-2">
                  <CardDescription>Year 2 ARR</CardDescription>
                  <CardTitle className="text-2xl text-blue-600">${year2Metrics.arr.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{year2Metrics.customers} customers</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardHeader className="pb-2">
                  <CardDescription>Year 3 ARR</CardDescription>
                  <CardTitle className="text-2xl text-purple-600">${year3Metrics.arr.toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{year3Metrics.customers} customers</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue & Expenses Forecast</CardTitle>
                <CardDescription>36-month projection based on your inputs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" name="Revenue" />
                      <Area type="monotone" dataKey="expenses" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive)/0.1)" name="Expenses" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Profit</CardTitle>
                <CardDescription>Monthly profit/loss trajectory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Profit"]}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Bar
                        dataKey="profit"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unit Economics Tab */}
          <TabsContent value="unit-economics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Revenue per User</CardDescription>
                  <CardTitle className="text-2xl text-primary">${avgPrice.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">per month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Customer Lifetime Value</CardDescription>
                  <CardTitle className="text-2xl text-primary">${ltv.toFixed(0)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">based on {avgChurn.toFixed(1)}% churn</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Customer Acquisition Cost</CardDescription>
                  <CardTitle className="text-2xl text-primary">${cac.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">marketing / new customers</p>
                </CardContent>
              </Card>
              <Card className={ltvCacRatio >= 3 ? "border-green-500/50" : ltvCacRatio >= 1 ? "border-yellow-500/50" : "border-red-500/50"}>
                <CardHeader className="pb-2">
                  <CardDescription>LTV:CAC Ratio</CardDescription>
                  <CardTitle className={`text-2xl ${ltvCacRatio >= 3 ? "text-green-500" : ltvCacRatio >= 1 ? "text-yellow-500" : "text-red-500"}`}>
                    {ltvCacRatio.toFixed(1)}x
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {ltvCacRatio >= 3 ? "Excellent ✓" : ltvCacRatio >= 1 ? "Needs improvement" : "⚠️ Below healthy"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Unit Economics Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Payback Period</h4>
                    <p className="text-2xl font-bold text-primary">
                      {avgPrice > 0 ? (cac / avgPrice).toFixed(1) : "N/A"} months
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time to recover customer acquisition cost
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Monthly Burn Rate</h4>
                    <p className="text-2xl font-bold text-destructive">
                      ${(expenses.salaries + expenses.marketing + expenses.infrastructure + expenses.other - 
                        streams.reduce((acc, s) => acc + s.price * s.customersMonth1, 0)).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Net monthly cash flow
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RevenueArchitect;
