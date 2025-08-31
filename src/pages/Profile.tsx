import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, MapPin, Calendar, Edit } from "lucide-react";

const Profile = () => {
  const userInterests = [
    "Hiking", "Basketball", "Cooking", "Photography", "Gaming", 
    "Fitness", "Music", "Travel", "Tech", "Reading"
  ];

  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-card border-border text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Alex Johnson</h1>
              <p className="text-muted-foreground mb-4">Software Developer</p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">Joined March 2024</span>
              </div>
              
              <Button className="w-full bg-gradient-primary">
                Edit Profile
              </Button>
            </Card>
          </div>
          
          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card border-border">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <Textarea 
                placeholder="Tell others about yourself, your interests, and what you're looking for in a friendship..."
                className="min-h-32"
                defaultValue="I'm a tech enthusiast who loves outdoor adventures and trying new restaurants. Looking to connect with fellow guys who enjoy hiking, basketball, and good conversations over coffee."
              />
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border">
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {userInterests.map((interest) => (
                  <Badge 
                    key={interest} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary/20"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm">
                Add Interest
              </Button>
            </Card>
            
            <Card className="p-6 bg-gradient-card border-border">
              <h2 className="text-xl font-semibold mb-4">Looking For</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Age Range</label>
                  <div className="flex space-x-2 mt-1">
                    <Input placeholder="Min" type="number" className="w-20" />
                    <Input placeholder="Max" type="number" className="w-20" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Distance</label>
                  <Input placeholder="Miles" type="number" className="mt-1" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;