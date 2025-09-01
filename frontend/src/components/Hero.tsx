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
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Connect with
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Like-Minded Men
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Build genuine friendships through shared interests, activities, and adventures. 
            For men who value real connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-glow-pulse w-full sm:w-auto"
            >
              Join Mustache <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-2">
            <div className="flex items-center justify-center space-x-3 p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div className="text-center sm:text-left">
                <p className="font-semibold text-sm sm:text-base">10K+ Members</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active community</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in [animation-delay:0.2s]">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div className="text-center sm:text-left">
                <p className="font-semibold text-sm sm:text-base">50+ Cities</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Worldwide reach</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border animate-scale-in [animation-delay:0.4s] sm:col-span-2 lg:col-span-1">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div className="text-center sm:text-left">
                <p className="font-semibold text-sm sm:text-base">500+ Events</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Monthly meetups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;