import { useState, useEffect, useRef } from "react";
import { Send, Mic, Bot, User } from "lucide-react";

export default function ChatWindow({
  messages,
  onSend,
  loading,
  onOrderConfirm,
}) {
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.start();
  };

  const parseOrderToken = (content) => {
    // Match both 2-part and 3-part tokens
    const regex3 = /\[ORDER_CONFIRMED:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\]/;
    const regex2 = /\[ORDER_CONFIRMED:\s*(.+?)\s*\|\s*(.+?)\s*\]/;
    const match3 = content.match(regex3);
    if (match3) {
      const notes = match3[3].trim().toLowerCase() === "none" ? "" : match3[3].trim();
      return {
        dish: match3[1].trim(),
        restaurant: match3[2].trim(),
        notes,
        cleanContent: content.replace(regex3, "").trim(),
      };
    }
    const match2 = content.match(regex2);
    if (match2) {
      return {
        dish: match2[1].trim(),
        restaurant: match2[2].trim(),
        notes: "",
        cleanContent: content.replace(regex2, "").trim(),
      };
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col bg-chat-bg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const orderInfo =
            !isUser ? parseOrderToken(msg.content) : null;
          const displayContent = orderInfo
            ? orderInfo.cleanContent
            : msg.content;

          return (
            <div key={i}>
              <div
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUser ? "bg-primary text-white" : "bg-sidebar text-white"
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-card text-gray-800 shadow-sm border border-card-border rounded-bl-md"
                  }`}
                >
                  {displayContent}
                </div>
              </div>
              {orderInfo && (
                <div className="ml-11 mt-3 p-4 bg-green-50 border border-green-200 rounded-2xl max-w-[75%]">
                  <p className="font-semibold text-green-800">
                    Order Ready!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    🍽️ {orderInfo.dish} from{" "}
                    <span className="font-medium">{orderInfo.restaurant}</span>
                  </p>
                  {orderInfo.notes && (
                    <p className="text-xs text-green-600 mt-1">
                      📝 {orderInfo.notes}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      onOrderConfirm(orderInfo.dish, orderInfo.restaurant, orderInfo.notes)
                    }
                    className="mt-3 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Complete Order
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-sidebar text-white">
              <Bot size={16} />
            </div>
            <div className="bg-card px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-card-border">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-card-border bg-card">
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoice}
            className={`p-3 rounded-xl transition-colors ${
              listening
                ? "bg-red-100 text-red-500"
                : "bg-input-bg text-muted hover:bg-card-border"
            }`}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-input-bg border border-card-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
