import { useState } from "react";
import { ArrowLeft, Search, Plus, MessageSquare, Heart, Share2, Bookmark, Filter, TrendingUp, Users, Lightbulb, Sparkles, MapPin, Brain, Loader2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { publicEnv } from "@/lib/env";

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    title: string;
    location: string;
    score: number;
  };
  type: "idea" | "feedback" | "cofounder" | "discussion";
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  aiAnalysis?: {
    score: number;
    viabilityRating: string;
    feedback: {
      strengths: string[];
      concerns: string[];
      suggestions: string[];
    };
    marketInsights: string;
    nextSteps: string[];
  };
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: { name: "Sarah Chen", title: "Ex-Stripe PM", location: "San Francisco", score: 847 },
    type: "idea",
    title: "AI-powered contract review for freelancers",
    content: "Thinking about building a tool that uses AI to review freelance contracts and flag problematic clauses. Most freelancers sign contracts they don't fully understand. Could save them from bad deals and legal trouble.",
    tags: ["AI", "Legal Tech", "Freelance"],
    likes: 42,
    comments: 18,
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    author: { name: "Marcus Johnson", title: "Full-stack Developer", location: "Austin", score: 723 },
    type: "cofounder",
    title: "Looking for technical co-founder for EdTech startup",
    content: "I've validated the idea with 50+ teachers. Have $10k in pre-orders. Building a platform for personalized learning paths. Need a technical co-founder who's passionate about education. Offering 30% equity.",
    tags: ["EdTech", "Co-founder", "Pre-revenue"],
    likes: 89,
    comments: 34,
    timestamp: "5 hours ago"
  },
  {
    id: "3",
    author: { name: "Priya Patel", title: "2x Founder", location: "London", score: 912 },
    type: "feedback",
    title: "Roast my landing page - B2B SaaS for inventory management",
    content: "Just launched our landing page after 3 iterations. Looking for brutal honest feedback. Our target is SMB retailers. What's working? What's not? Conversion rate is at 2.3% and I know we can do better.",
    tags: ["B2B", "SaaS", "Feedback Request"],
    likes: 156,
    comments: 67,
    timestamp: "1 day ago"
  },
  {
    id: "4",
    author: { name: "Alex Kim", title: "Product Designer", location: "NYC", score: 654 },
    type: "discussion",
    title: "What's your customer acquisition strategy at $0 budget?",
    content: "Curious how other early-stage founders are acquiring customers without paid ads. Cold outreach? Content marketing? Community building? Share what's actually working for you in 2024.",
    tags: ["Growth", "Marketing", "Bootstrap"],
    likes: 234,
    comments: 89,
    timestamp: "2 days ago"
  },
  {
    id: "5",
    author: { name: "Elena Rodriguez", title: "AI Researcher", location: "Berlin", score: 789 },
    type: "idea",
    title: "Voice cloning for personalized audiobooks",
    content: "What if you could have your favorite author (or anyone) narrate audiobooks in their voice? With consent and licensing of course. The tech exists—is there a market? Thinking subscription model for publishers.",
    tags: ["AI", "Audio", "Consumer"],
    likes: 67,
    comments: 23,
    timestamp: "3 days ago"
  },
];

const Ideaverse = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    type: "idea" as Post["type"],
    title: "",
    content: "",
    tags: ""
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || post.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
    toast({ title: "Saved!", description: "Post added to your bookmarks." });
  };

  const analyzeIdea = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post || post.type !== "idea") return;

    setIsAnalyzing(postId);

    try {
      const response = await fetch(`${publicEnv.supabaseUrl}/functions/v1/idea-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicEnv.supabasePublishableKey}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          type: "idea"
        }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const analysis = await response.json();
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, aiAnalysis: analysis };
        }
        return p;
      }));

      toast({ title: "Analysis complete!", description: "AI has evaluated this idea." });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Analysis failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsAnalyzing(null);
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: { name: "You", title: "Founder", location: "Your Location", score: 500 },
      type: newPost.type,
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags.split(",").map(t => t.trim()).filter(Boolean),
      likes: 0,
      comments: 0,
      timestamp: "Just now"
    };
    
    setPosts([post, ...posts]);
    setIsCreateOpen(false);
    setNewPost({ type: "idea", title: "", content: "", tags: "" });
    toast({ title: "Posted!", description: "Your post is now live in the community." });
  };

  const getTypeBadge = (type: Post["type"]) => {
    const styles: Record<Post["type"], { bg: string; icon: any }> = {
      idea: { bg: "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary", icon: Lightbulb },
      feedback: { bg: "bg-accent/10 text-accent dark:bg-accent/30 dark:text-accent", icon: MessageSquare },
      cofounder: { bg: "bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary", icon: Users },
      discussion: { bg: "bg-accent/10 text-accent dark:bg-accent/30 dark:text-accent", icon: TrendingUp },
    };
    const style = styles[type];
    const Icon = style.icon;
    return (
      <Badge className={`${style.bg} border-0 gap-1`}>
        <Icon className="w-3 h-3" />
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Ideaverse Hub
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Insights
                </Badge>
              </h1>
              <p className="text-sm text-muted-foreground">Connect with founders worldwide</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create a Post</DialogTitle>
                <DialogDescription>Share an idea, ask for feedback, or connect with co-founders.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Post Type</Label>
                  <Select value={newPost.type} onValueChange={(v) => setNewPost({ ...newPost, type: v as Post["type"] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">💡 Share an Idea</SelectItem>
                      <SelectItem value="feedback">💬 Request Feedback</SelectItem>
                      <SelectItem value="cofounder">👥 Find Co-founder</SelectItem>
                      <SelectItem value="discussion">📈 Start Discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your post about?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts, details, or questions..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="SaaS, AI, B2B"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePost}>Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, ideas, founders..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="idea">💡 Ideas</TabsTrigger>
            <TabsTrigger value="feedback">💬 Feedback</TabsTrigger>
            <TabsTrigger value="cofounder">👥 Co-founders</TabsTrigger>
            <TabsTrigger value="discussion">📈 Discussions</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{post.author.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {post.author.score}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.author.title}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {post.author.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getTypeBadge(post.type)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3">{post.content}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                {/* AI Analysis */}
                {post.type === "idea" && !post.aiAnalysis && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2 mt-2"
                    onClick={() => analyzeIdea(post.id)}
                    disabled={isAnalyzing === post.id}
                  >
                    {isAnalyzing === post.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    {isAnalyzing === post.id ? "Analyzing..." : "Get AI Analysis"}
                  </Button>
                )}

                {post.aiAnalysis && (
                  <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-accent/20">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Brain className="w-4 h-4 text-primary" />
                          AI Viability Score
                        </span>
                        <Badge className={`${
                          post.aiAnalysis.score >= 70 ? "bg-green-500" : 
                          post.aiAnalysis.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                        } text-white border-0`}>
                          {post.aiAnalysis.score}/100
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-green-600">Strengths: </span>
                          <span className="text-muted-foreground">{post.aiAnalysis.feedback.strengths.join(", ")}</span>
                        </div>
                        <div>
                          <span className="font-medium text-yellow-600">Consider: </span>
                          <span className="text-muted-foreground">{post.aiAnalysis.feedback.concerns.join(", ")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 ${post.isLiked ? "text-red-500" : ""}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.comments}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={post.isBookmarked ? "text-primary" : ""}
                    onClick={() => handleBookmark(post.id)}
                  >
                    <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardFooter>
              <div className="px-6 pb-4">
                <span className="text-xs text-muted-foreground">{post.timestamp}</span>
              </div>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button onClick={() => setIsCreateOpen(true)}>Create the first post</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Ideaverse;
