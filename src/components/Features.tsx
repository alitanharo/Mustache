import { Card } from "@/components/ui/card";
import { UserPlus, MapPin, Calendar, Shield, MessageCircle, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: UserPlus,
      title: "Smart Matching",
      description: "Connect with men who share your interests, hobbies, and lifestyle preferences."
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Find friends in your area for coffee, sports, or weekend adventures."
    },
    {
      icon: Calendar,
      title: "Group Activities",
      description: "Join or create events like hiking, gaming, sports, or professional networking."
    },
    {
      icon: Shield,
      title: "Men-Only Platform",
      description: "A safe space designed specifically for genuine male friendships."
    },
    {
      icon: MessageCircle,
      title: "Easy Communication",
      description: "Start conversations through shared interests and planned activities."
    },
    {
      icon: Zap,
      title: "Quick Connections",
      description: "4-step process to go from profile to meeting new friends."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Mustache?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've built the perfect platform for men to form meaningful friendships 
            based on shared interests and genuine connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-8 bg-gradient-card border-border hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-primary/10 mr-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;