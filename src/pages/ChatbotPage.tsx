import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { chatMessages as initialMessages, quickReplies, botResponses } from "../data/mockData";

type Message = { id: number; role: "user" | "bot"; text: string };

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([...initialMessages]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(2);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    const userMsg: Message = { id: idRef.current++, role: "user", text };
    setMessages((current) => [...current, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = botResponses[text] || "I'm not sure about that yet. Try asking about routes, coaches, or timings.";
      setMessages((current) => [...current, { id: idRef.current++, role: "bot", text: reply }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border/50">
        <button onClick={() => navigate(-1)} className="active:opacity-70">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground">Hamrahi AI</h1>
          <p className="text-[10px] text-crowd-low">Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-float-up`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                message.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-foreground rounded-bl-md"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-muted-foreground"
                  style={{ animation: "typing-dot 1.4s infinite", animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => sendMessage(reply)}
            className="shrink-0 px-3 py-1.5 rounded-full border border-primary/30 text-xs text-primary active:bg-primary/10 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4 pt-2 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && input.trim() && sendMessage(input.trim())}
          placeholder="Ask Hamrahi AI..."
          className="flex-1 bg-secondary text-foreground text-sm px-4 py-3 rounded-2xl outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={() => input.trim() && sendMessage(input.trim())}
          className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
