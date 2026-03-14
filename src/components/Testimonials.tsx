import { StaggerTestimonials } from "./ui/stagger-testimonials";

const Testimonials = () => {
  return (
    <section className="bg-[#FFFFFF] py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-black text-3xl md:text-4xl font-bold mb-4 font-tanker">
            Founders Love OMISP
          </h2>
          <p className="text-black/70 max-w-2xl mx-auto">
            Join thousands of founders who've accelerated their fundraising journey with OMISP
          </p>
        </div>

        {/* Stagger Testimonials Component */}
        <StaggerTestimonials />
      </div>
    </section>
  );
};

export default Testimonials;
