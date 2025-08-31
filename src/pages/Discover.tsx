import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, X, MapPin, Users, Search, Filter } from "lucide-react";

const Discover = () => {
  const potentialFriends = [
    {
      id: 1,
      name: "Marcus Chen",
      age: 29,
      location: "2 miles away",
      bio: "Love hiking, cooking, and weekend basketball games. Always up for trying new restaurants!",
      interests: ["Hiking", "Basketball", "Cooking", "Photography"],
      image: null
    },
    {
      id: 2,
      name: "David Rodriguez",
      age: 32,
      location: "5 miles away", 
      bio: "Tech entrepreneur looking for gym buddies and fellow gamers. Let's grab coffee and talk startups!",
      interests: ["Fitness", "Gaming", "Tech", "Coffee"],
      image: null
    },
    {
      id: 3,
      name: "James Wilson",
      age: 27,
      location: "3 miles away",
      bio: "Musician and music lover. Looking for concert buddies and people to jam with.",
      interests: ["Music", "Concerts", "Guitar", "Travel"],
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Discover Your Next <span className="bg-gradient-primary bg-clip-text text-transparent">Friendship</span>
          </h1>
          <p className="text-muted-foreground text-lg">Find like-minded men in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by interests, hobbies, or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Friend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potentialFriends.map((friend) => (
            <Card key={friend.id} className="p-6 bg-gradient-card border-border hover:shadow-card transition-all duration-300">
              <div className="text-center mb-4">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{friend.name}</h3>
                <p className="text-muted-foreground">{friend.age} years old</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{friend.location}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 text-center leading-relaxed">
                {friend.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {friend.interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {friend.interests.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{friend.interests.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <X className="h-4 w-4 mr-1" />
                  Pass
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-primary">
                  <Heart className="h-4 w-4 mr-1" />
                  Connect
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Profiles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Discover;