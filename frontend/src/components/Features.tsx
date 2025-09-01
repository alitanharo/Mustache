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
    <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Mustache?</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            We've built the perfect platform for men to form meaningful friendships 
            based on shared interests and genuine connections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-6 sm:p-8 bg-gradient-card border-border hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-xl bg-primary/10 mr-3 sm:mr-4">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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