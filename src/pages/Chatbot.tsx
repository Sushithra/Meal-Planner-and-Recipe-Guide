import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { generateResponse, saveChatMessage, getChatHistory, ChatMessage } from "@/services/chatService";
import { getProfile, getDietaryRestrictions, getDislikedIngredients } from "@/services/profileService";
const Chatbot = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      try {
        // Fetch chat history
        const history = await getChatHistory(user.id);
        setMessages(history.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()));

        // Fetch user profile and preferences for better suggestions
        const profile = await getProfile(user.id);
        const restrictions = await getDietaryRestrictions(user.id);
        const disliked = await getDislikedIngredients(user.id);
        setUserData({
          profile,
          restrictions: restrictions.map(r => r.restriction),
          dislikedIngredients: disliked.map(d => d.ingredient)
        });
      } catch (error) {
        console.error("Error fetching chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setInitialLoading(false);
      }
    };
    fetchChatHistory();
  }, [user, toast]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userInput.trim()) return;
    try {
      setIsLoading(true);

      // Generate response based on user input
      const response = await generateResponse(userInput, userData);

      // Save the message to database
      const savedMessage = await saveChatMessage(user.id, userInput, response);
      setMessages([...messages, savedMessage]);
      setUserInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const getWelcomeMessage = () => {
    if (!userData?.profile) {
      return "Hello! I'm your nutrition assistant. To get personalized recommendations, consider completing your profile with your health goals and preferences.";
    }
    let message = `Hello ${userData.profile.full_name || "there"}! I'm your nutrition assistant.`;
    if (userData.profile.health_goal) {
      const goalMap: {
        [key: string]: string;
      } = {
        weight_loss: "weight loss",
        weight_gain: "weight gain",
        muscle_building: "muscle building",
        maintenance: "maintaining your current weight",
        general_health: "improving your general health"
      };
      message += ` I see your health goal is ${goalMap[userData.profile.health_goal] || userData.profile.health_goal}.`;
    }
    message += " How can I help you with your nutrition needs today?";
    return message;
  };
  return <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Nutrition Assistant</h1>
      
      <div className="border rounded-lg h-[calc(100vh-250px)] flex flex-col">
        <div className="p-4 bg-muted/50 border-b">
          <h2 className="font-medium">Chat with your nutrition AI assistant</h2>
          <p className="text-sm text-muted-foreground">
            Ask about meal suggestions, nutrition advice, or recipe ideas based on your preferences.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {initialLoading ? <div className="flex justify-center items-center h-full">
              <p>Loading chat history...</p>
            </div> : messages.length === 0 ? <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium">Assistant</p>
              <p>{getWelcomeMessage()}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try asking questions like:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Suggest a high-protein breakfast</li>
                <li>What are some healthy snacks for weight loss?</li>
                <li>Give me a meal plan for muscle building</li>
                <li>What should I eat if I'm vegetarian?</li>
              </ul>
            </div> : messages.map(message => <div key={message.id} className="space-y-4">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <p className="font-medium text-right">You</p>
                  <p className="px-0 py-0 text-right mx-0 my-0">{message.user_message}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium">Assistant</p>
                  <p>{message.assistant_response}</p>
                </div>
              </div>)}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Ask about meal suggestions, nutrition advice..." disabled={isLoading || initialLoading} className="flex-1" />
            <Button type="submit" disabled={isLoading || !userInput.trim() || initialLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </div>;
};
export default Chatbot;
