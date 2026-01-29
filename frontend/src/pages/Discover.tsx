import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Search, Filter, MapPin, Calendar, Users, Heart, MessageSquare, 
  Star, X, ChevronLeft, ChevronRight, Settings
} from "lucide-react";
import mustacheLogo from "@/assets/mustache-logo.jpg";
import { apiRequest } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

type DiscoverUser = {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  matchScore?: number;
};

const Discover = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    ageRange: [25, 45],
    distance: 50,
    interests: [] as string[],
    location: ""
  });

  const [users, setUsers] = useState<DiscoverUser[]>([]);

  const allInterests = [
    "Sports", "Gaming", "Fitness", "Music", "Travel", "Food", "Technology", 
    "Reading", "Photography", "Art", "Business", "Education", "Outdoors", "Movies",
    "Beer", "Coffee", "Cars", "Fashion", "Pets", "Cooking", "Dancing"
  ];

  const currentUser = users[currentProfileIndex];

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ data: { recommendations: DiscoverUser[] } }>("/api/discover/recommendations");
      setUsers(response.data.recommendations || []);
      setCurrentProfileIndex(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load recommendations";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ data: { users: DiscoverUser[] } }>(`/api/discover/search?q=${encodeURIComponent(searchQuery)}`);
      setUsers(response.data.users || []);
      setCurrentProfileIndex(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Search failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const handleInterestToggle = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      await apiRequest(`/api/friends/request/${currentUser._id}`, { method: "POST" });
      toast.success("Friend request sent!");
      nextProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send request";
      toast.error(message);
    }
  };

  const handlePass = () => {
    nextProfile();
  };

  const handleMessage = () => {
    toast.info("Open the Messages page to start chatting.");
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (users.length ? (prev + 1) % users.length : 0));
  };

  const prevProfile = () => {
    setCurrentProfileIndex((prev) => (users.length ? (prev - 1 + users.length) % users.length : 0));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Discover Friends</h1>
            <p className="text-muted-foreground">
              Find like-minded men in your area
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Filters
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Age Range */}
                  <div className="space-y-3">
                    <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</Label>
                    <Slider
                      value={filters.ageRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, ageRange: value as number[] }))}
                      max={70}
                      min={18}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Distance */}
                  <div className="space-y-3">
                    <Label>Distance: {filters.distance} miles</Label>
                    <Slider
                      value={[filters.distance]}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value[0] }))}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="City, State"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label>Interests</Label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {allInterests.map((interest) => (
                        <Badge
                          key={interest}
                          variant={filters.interests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => handleInterestToggle(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:shadow-glow">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by interests, location, or keywords..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchUsers();
                    }
                  }}
                />
              </div>
            </div>

            {/* Profile Card */}
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading profiles...</div>
            ) : !currentUser ? (
              <div className="text-center text-muted-foreground">No profiles found. Try another search.</div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-0">
                  {/* Profile Image */}
                  <div className="relative">
                    <img
                      src={currentUser.photos?.[0] || mustacheLogo}
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />

                    {/* Compatibility Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        {currentUser.matchScore || 0}% Match
                      </Badge>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevProfile}
                        className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextProfile}
                        className="h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {currentUser.firstName} {currentUser.lastName}
                        </h2>
                        <div className="flex items-center space-x-4 text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {currentUser.age} years old
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {currentUser.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {filters.distance} miles away
                          </span>
                        </div>
                      </div>

                      <Badge variant="outline" className="text-primary border-primary">
                        {currentUser.interests?.length || 0} interests
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {currentUser.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentUser.interests?.map((interest: string) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePass}
                        className="flex-1 border-muted-foreground text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Pass
                      </Button>

                      <Button
                        size="lg"
                        onClick={handleMessage}
                        className="flex-1 bg-gradient-primary hover:shadow-glow"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Message
                      </Button>

                      <Button
                        size="lg"
                        onClick={handleLike}
                        className="flex-1 bg-gradient-primary hover:shadow-glow"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Like
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Counter */}
            {currentUser && (
              <div className="text-center mt-6">
                <p className="text-muted-foreground">
                  Profile {currentProfileIndex + 1} of {users.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;