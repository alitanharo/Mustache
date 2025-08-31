import { Button } from "@/components/ui/button";
import { ArrowRight, Users, MapPin, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connect with
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Like-Minded Men
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build genuine friendships through shared interests, activities, and adventures. 
            For men who value real connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 animate-glow-pulse"
            >
              Join Mustache <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">10K+ Members</p>
                <p className="text-sm text-muted-foreground">Active community</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in [animation-delay:0.2s]">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">50+ Cities</p>
                <p className="text-sm text-muted-foreground">Worldwide reach</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in [animation-delay:0.4s]">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">500+ Events</p>
                <p className="text-sm text-muted-foreground">Monthly meetups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;