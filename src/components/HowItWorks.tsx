const steps = [
  {
    number: "01",
    title: "Build Your Profile",
    description: "Create your founder profile and start using our AI-powered tools",
  },
  {
    number: "02",
    title: "Train & Improve",
    description: "Practice pitching, build financial models, and learn through simulation",
  },
  {
    number: "03",
    title: "Track Progress",
    description: "Log real milestones like revenue, team size, and funding to boost your score",
  },
  {
    number: "04",
    title: "Get Discovered",
    description: "VCs find you through OMISP Capital based on your verified credibility",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How OMISP Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple path from aspiring founder to funded startup.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-6xl font-bold text-primary/20 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
