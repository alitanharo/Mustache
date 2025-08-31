import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Users, MessageSquare } from "lucide-react";

const Messages = () => {
  const conversations = [
    {
      id: 1,
      name: "Marcus Chen",
      lastMessage: "Sounds great! Let's meet at the trail at 8am",
      time: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "David Rodriguez", 
      lastMessage: "That restaurant was amazing, thanks for the recommendation!",
      time: "1h ago",
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: "James Wilson",
      lastMessage: "The concert tickets are selling fast, should we get them?",
      time: "3h ago", 
      unread: 1,
      online: true
    }
  ];

  const selectedConversation = conversations[0];

  const messages = [
    {
      id: 1,
      sender: "Marcus Chen",
      content: "Hey! I saw you're into hiking too. There's a great trail I discovered last weekend.",
      time: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "That sounds awesome! I've been looking for new trails to explore. Where is it?",
      time: "10:32 AM", 
      isOwn: true
    },
    {
      id: 3,
      sender: "Marcus Chen",
      content: "It's the Bear Mountain trail, about 30 minutes from downtown. Want to check it out this weekend?",
      time: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      content: "Absolutely! Saturday morning works for me. What time should we meet?",
      time: "10:37 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Marcus Chen", 
      content: "Sounds great! Let's meet at the trail at 8am",
      time: "10:40 AM",
      isOwn: false
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-gradient-card border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </div>
              
              <div className="overflow-y-auto h-full">
                {conversations.map((conversation) => (
                  <div 
                    key={conversation.id}
                    className="p-4 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{conversation.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      
                      {conversation.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-gradient-card border-border flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedConversation.name}</h3>
                    <p className="text-sm text-primary">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                  />
                  <Button size="sm" className="bg-gradient-primary">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;