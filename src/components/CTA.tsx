import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Build Your Credibility?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join 12,000+ founders who are proving their potential and getting discovered by top VCs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Building Your Score
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/capital">
              <Button size="lg" variant="outline">
                I'm a VC
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
