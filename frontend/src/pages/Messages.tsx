import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Send, MoreVertical, Phone, Video, Image, 
  Smile, Paperclip, Mic, ArrowLeft, MessageSquare
} from "lucide-react";
import mustacheLogo from "@/assets/mustache-logo.jpg";
import { apiRequest } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

type Conversation = {
  conversationId: string;
  otherUser: {
    _id: string;
    firstName: string;
    lastName: string;
    photos?: string[];
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
};

type ChatMessage = {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    photos?: string[];
  };
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
    photos?: string[];
  };
  content: string;
  createdAt: string;
};

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const currentChat = conversations[selectedChat];

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ data: { conversations: Conversation[] } }>("/api/messages/conversations");
      setConversations(response.data.conversations || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load conversations";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await apiRequest<{ data: { messages: ChatMessage[] } }>(`/api/messages/${conversationId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load messages";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentChat?.conversationId) {
      loadMessages(currentChat.conversationId);
    } else {
      setMessages([]);
    }
  }, [currentChat?.conversationId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentChat) return;
    try {
      const response = await apiRequest<{ data: { message: ChatMessage } }>("/api/messages", {
        method: "POST",
        body: {
          recipientId: currentChat.otherUser._id,
          content: messageInput
        }
      });
      setMessages((prev) => [...prev, response.data.message]);
      setMessageInput("");
      loadConversations();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.lastName.toLowerCase().includes(searchQuery.toLowerCase())
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
              {isLoading ? (
                <div className="p-4 text-muted-foreground">Loading conversations...</div>
              ) : (
                filteredConversations.map((conversation, index) => (
                  <div
                    key={conversation.conversationId}
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
                          <AvatarImage src={conversation.otherUser.photos?.[0] || mustacheLogo} alt="Avatar" />
                          <AvatarFallback>
                            {conversation.otherUser.firstName[0]}{conversation.otherUser.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {conversation.otherUser.firstName} {conversation.otherUser.lastName}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.lastMessage?.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
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
                        <AvatarImage src={currentChat.otherUser.photos?.[0] || mustacheLogo} alt="Avatar" />
                        <AvatarFallback>
                          {currentChat.otherUser.firstName[0]}{currentChat.otherUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div>
                      <h2 className="font-semibold">
                        {currentChat.otherUser.firstName} {currentChat.otherUser.lastName}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Active now
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
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender._id === user?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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