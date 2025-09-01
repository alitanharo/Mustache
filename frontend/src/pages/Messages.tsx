import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Send, MoreVertical, Phone, Video, Image, 
  Smile, Paperclip, Mic, ArrowLeft, Online, MessageSquare
} from "lucide-react";
import mustacheLogo from "@/assets/mustache-logo.jpg";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in real app this would come from backend
  const conversations = [
    {
      id: 1,
      user: {
        firstName: "Michael",
        lastName: "Chen",
        avatar: mustacheLogo,
        isOnline: true,
        lastSeen: "2 min ago"
      },
      lastMessage: "Hey! Are you free this weekend for that hiking trip?",
      timestamp: "2:30 PM",
      unreadCount: 2,
      isActive: true
    },
    {
      id: 2,
      user: {
        firstName: "David",
        lastName: "Rodriguez",
        avatar: mustacheLogo,
        isOnline: false,
        lastSeen: "1 hour ago"
      },
      lastMessage: "Thanks for the gym tips yesterday!",
      timestamp: "1:45 PM",
      unreadCount: 0,
      isActive: false
    },
    {
      id: 3,
      user: {
        firstName: "Alex",
        lastName: "Thompson",
        avatar: mustacheLogo,
        isOnline: true,
        lastSeen: "5 min ago"
      },
      lastMessage: "The new coffee shop downtown is amazing!",
      timestamp: "12:20 PM",
      unreadCount: 1,
      isActive: false
    }
  ];

  const currentChat = conversations[selectedChat];

  const mockMessages = [
    {
      id: 1,
      senderId: 1,
      text: "Hey! Are you free this weekend for that hiking trip?",
      timestamp: "2:30 PM",
      isOwn: false
    },
    {
      id: 2,
      senderId: 0,
      text: "Hey Michael! Yeah, I'm definitely interested. What's the plan?",
      timestamp: "2:32 PM",
      isOwn: true
    },
    {
      id: 3,
      senderId: 1,
      text: "Thinking of heading to Mount Tam on Saturday morning. There's a great trail that's about 6 miles round trip.",
      timestamp: "2:33 PM",
      isOwn: false
    },
    {
      id: 4,
      senderId: 0,
      text: "That sounds perfect! What time were you thinking?",
      timestamp: "2:35 PM",
      isOwn: true
    },
    {
      id: 5,
      senderId: 1,
      text: "How about meeting at the trailhead at 8 AM? We can grab coffee in Mill Valley first if you want.",
      timestamp: "2:36 PM",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Send message to backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex">
        {/* Conversations Sidebar */}
        <div className="w-full sm:w-80 lg:w-96 border-r border-border bg-card/50">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold mb-2">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-2">
              {filteredConversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === index
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedChat(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.user.avatar} alt="Avatar" />
                        <AvatarFallback>
                          {conversation.user.firstName[0]}{conversation.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">
                          {conversation.user.firstName} {conversation.user.lastName}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.timestamp}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-card/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="sm:hidden"
                      onClick={() => setSelectedChat(-1)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentChat.user.avatar} alt="Avatar" />
                        <AvatarFallback>
                          {currentChat.user.firstName[0]}{currentChat.user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {currentChat.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div>
                      <h2 className="font-semibold">
                        {currentChat.user.firstName} {currentChat.user.lastName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentChat.user.isOnline ? "Online" : currentChat.user.lastSeen}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-card/50">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mic className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="bg-gradient-primary hover:shadow-glow"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;