import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const Community = () => {
  const testimonials = [
    {
      name: "Marcus Johnson",
      age: 28,
      location: "San Francisco",
      rating: 5,
      text: "Found my hiking buddy and poker night crew through Mustache. The quality of connections here is incredible.",
      interests: ["Hiking", "Poker", "Tech"]
    },
    {
      name: "David Chen", 
      age: 34,
      location: "New York",
      rating: 5,
      text: "As someone new to the city, Mustache helped me build a solid friend group. Great platform for genuine connections.",
      interests: ["Basketball", "Cooking", "Finance"]
    },
    {
      name: "Alex Rivera",
      age: 31,
      location: "Austin",
      rating: 5, 
      text: "The men-only environment makes it so much easier to form authentic friendships without any awkwardness.",
      interests: ["Music", "Fitness", "Startups"]
    }
  ];

  const activities = [
    "Weekend Hiking", "Poker Nights", "Sports Watching", "Gym Partners",
    "Gaming Sessions", "Food Tours", "Professional Networking", "Book Clubs",
    "Photography Walks", "Cycling Groups", "Barbecue Meetups", "Trivia Nights"
  ];

  return (
    <section id="community" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Join Our <span className="bg-gradient-primary bg-clip-text text-transparent">Brotherhood</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Real stories from real men who've built lasting friendships through Mustache.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="p-6 sm:p-8 bg-gradient-card border-border hover:shadow-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-4 sm:pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.age} • {testimonial.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {testimonial.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Popular Activities */}
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Popular Activities</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto px-2">
            {activities.map((activity, index) => (
              <Badge 
                key={activity} 
                variant="outline" 
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border-primary/30 hover:bg-primary/10 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
            asChild
          >
            <Link to="/register">Join 10,000+ Members</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Community;