import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

type Friend = {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  isOnline?: boolean;
  lastSeen?: string;
};

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const [friendsRes, requestsRes, sentRes] = await Promise.all([
        apiRequest<{ data: { friends: Friend[] } }>("/api/friends"),
        apiRequest<{ data: { friendRequests: Friend[] } }>("/api/friends/requests"),
        apiRequest<{ data: { sentFriendRequests: Friend[] } }>("/api/friends/sent")
      ]);

      setFriends(friendsRes.data.friends || []);
      setRequests(requestsRes.data.friendRequests || []);
      setSentRequests(sentRes.data.sentFriendRequests || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load friends";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  const handleRequestAction = async (userId: string, action: "accept" | "reject") => {
    try {
      await apiRequest(`/api/friends/${action}/${userId}`, { method: "POST" });
      toast.success(`Request ${action}ed`);
      loadFriends();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Action failed";
      toast.error(message);
    }
  };

  const handleCancelRequest = async (userId: string) => {
    try {
      await apiRequest(`/api/friends/cancel/${userId}`, { method: "POST" });
      toast.success("Request cancelled");
      loadFriends();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cancel failed";
      toast.error(message);
    }
  };

  const handleRemoveFriend = async (userId: string) => {
    try {
      await apiRequest(`/api/friends/${userId}`, { method: "DELETE" });
      toast.success("Friend removed");
      loadFriends();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Remove failed";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading friends...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Friends</h1>
            <p className="text-muted-foreground">Manage your connections</p>
          </div>
          <Button variant="outline" onClick={loadFriends}>Refresh</Button>
        </div>

        <Tabs defaultValue="friends">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <p className="text-muted-foreground">No friends yet.</p>
            ) : (
              friends.map((friend) => (
                <Card key={friend._id}>
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.photos?.[0]} alt={friend.firstName} />
                        <AvatarFallback>
                          {friend.firstName?.[0]}{friend.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{friend.firstName} {friend.lastName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {friend.location || "Unknown location"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => handleRemoveFriend(friend._id)}>
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-muted-foreground">No incoming requests.</p>
            ) : (
              requests.map((request) => (
                <Card key={request._id}>
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.photos?.[0]} alt={request.firstName} />
                        <AvatarFallback>
                          {request.firstName?.[0]}{request.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{request.firstName} {request.lastName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.location || "Unknown location"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleRequestAction(request._id, "accept")}>Accept</Button>
                      <Button variant="outline" onClick={() => handleRequestAction(request._id, "reject")}>Reject</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <p className="text-muted-foreground">No sent requests.</p>
            ) : (
              sentRequests.map((request) => (
                <Card key={request._id}>
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.photos?.[0]} alt={request.firstName} />
                        <AvatarFallback>
                          {request.firstName?.[0]}{request.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{request.firstName} {request.lastName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.location || "Unknown location"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => handleCancelRequest(request._id)}>
                      Cancel Request
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;