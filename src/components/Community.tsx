import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

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
    <section id="community" className="py-20 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our <span className="bg-gradient-primary bg-clip-text text-transparent">Brotherhood</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real men who've built lasting friendships through Mustache.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="p-8 bg-gradient-card border-border hover:shadow-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center mb-4">
                <Quote className="h-6 w-6 text-primary mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
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
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-8">Popular Activities</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {activities.map((activity, index) => (
              <Badge 
                key={activity} 
                variant="outline" 
                className="px-4 py-2 text-sm border-primary/30 hover:bg-primary/10 transition-colors animate-fade-in"
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
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
          >
            Join 10,000+ Members
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Community;