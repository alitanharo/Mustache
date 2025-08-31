import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Search, MessageSquare, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: User,
      step: "01",
      title: "Create Your Profile",
      description: "Share your interests, hobbies, and what you're looking for in a friendship. Add photos and tell your story."
    },
    {
      icon: Search,
      step: "02", 
      title: "Discover Friends",
      description: "Browse profiles of men in your area who share similar interests and lifestyle preferences."
    },
    {
      icon: MessageSquare,
      step: "03",
      title: "Start Conversations",
      description: "Break the ice by commenting on shared interests or suggesting activities you'd both enjoy."
    },
    {
      icon: Users,
      step: "04",
      title: "Meet & Connect",
      description: "Plan activities, join group events, or meet one-on-one to build lasting friendships."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Making Friends is <span className="bg-gradient-primary bg-clip-text text-transparent">Simple</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow our 4-step process to connect with like-minded men and build meaningful friendships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card 
              key={step.step}
              className="p-8 bg-gradient-card border-border hover:shadow-card transition-all duration-300 text-center relative animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {step.step}
                </div>
              </div>
              
              <div className="mt-8 mb-6">
                <div className="p-4 rounded-xl bg-primary/10 inline-block">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
          >
            Start Building Friendships
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;