import { MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (["/chatbot", "/ticketing", "/route-details", "/crowd-detection"].includes(location.pathname)) {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/chatbot")}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" />
    </button>
  );
};

export default FloatingChatButton;
