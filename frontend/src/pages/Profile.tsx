import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, MapPin, Calendar, Edit3, Save, X, Plus, 
  Camera, Settings, Heart, Users, MessageSquare, Activity
} from "lucide-react";
import mustacheLogo from "@/assets/mustache-logo.jpg";
import { apiRequest } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

type ProfileUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  age?: number;
  privacySettings?: {
    profileVisibility: "public" | "friends" | "private";
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { refresh } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    location: "",
    bio: "",
    interests: [] as string[],
    photos: [mustacheLogo],
    age: 0,
    privacySettings: {
      profileVisibility: "public",
      showOnlineStatus: true,
      allowFriendRequests: true
    }
  });

  const [newInterest, setNewInterest] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestAdd = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const handleInterestRemove = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ data: { user: ProfileUser } }>("/api/users/profile");
      const user = response.data.user;
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
        location: user.location || "",
        bio: user.bio || "",
        interests: user.interests || [],
        photos: user.photos && user.photos.length > 0 ? user.photos : [mustacheLogo],
        age: user.age || 0,
        privacySettings: user.privacySettings || {
          profileVisibility: "public",
          showOnlineStatus: true,
          allowFriendRequests: true
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load profile";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ data: { user: ProfileUser } }>("/api/users/profile", {
        method: "PUT",
        body: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          bio: profileData.bio,
          location: profileData.location,
          interests: profileData.interests
        }
      });
      setProfileData((prev) => ({
        ...prev,
        ...response.data.user
      }));
      await refresh();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyChange = async (updates: { profileVisibility?: string; showOnlineStatus?: boolean; allowFriendRequests?: boolean }) => {
    try {
      const response = await apiRequest<{ data: { user: ProfileUser } }>("/api/users/privacy", {
        method: "PUT",
        body: updates
      });
      setProfileData((prev) => ({
        ...prev,
        privacySettings: response.data.user.privacySettings
      }));
      toast.success("Privacy settings updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update privacy settings";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const stats = [
    { label: "Friends", value: "24", icon: Users },
    { label: "Messages", value: "156", icon: MessageSquare },
    { label: "Activities", value: "8", icon: Activity },
    { label: "Likes", value: "42", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                <AvatarImage src={profileData.photos[0]} alt="Profile" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {profileData.age} years old • {profileData.location}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {profileData.interests.length > 3 && (
                    <Badge variant="outline">+{profileData.interests.length - 3} more</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-gradient-primary hover:shadow-glow">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profileData.firstName}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profileData.lastName}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profileData.email}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profileData.dateOfBirth}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-muted rounded-md">{profileData.location}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>
                  Tell others about yourself and what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <CardTitle>Interests & Hobbies</CardTitle>
                <CardDescription>
                  What activities and topics interest you?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-sm">
                      {interest}
                      {isEditing && (
                        <button
                          onClick={() => handleInterestRemove(interest)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleInterestAdd()}
                    />
                    <Button onClick={handleInterestAdd} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photos</CardTitle>
                <CardDescription>
                  Add photos to help others get to know you better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {profileData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {isEditing && (
                        <button className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <button className="w-full h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary transition-colors">
                      <Camera className="h-8 w-8 mr-2" />
                      Add Photo
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Privacy Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Profile Visibility</span>
                      <select
                        className="p-2 bg-muted border border-border rounded-md text-sm"
                        value={profileData.privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange({ profileVisibility: e.target.value })}
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Online Status</span>
                      <input
                        type="checkbox"
                        checked={profileData.privacySettings.showOnlineStatus}
                        onChange={(e) => handlePrivacyChange({ showOnlineStatus: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Allow Friend Requests</span>
                      <input
                        type="checkbox"
                        checked={profileData.privacySettings.allowFriendRequests}
                        onChange={(e) => handlePrivacyChange({ allowFriendRequests: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <Button variant="destructive" className="w-full">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;