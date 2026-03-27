import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, User } from "lucide-react";
import api from "../services/api";

function formatMarkdown(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ChatDetail() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api
      .get(`/chat/${chatId}`)
      .then(({ data }) => setChat(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-bold text-gray-900">Chat not found</h3>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/history")}
          className="p-2 rounded-xl hover:bg-card-border transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Chat Session #{chat.id}
          </h1>
          <p className="text-muted text-sm">
            {new Date(chat.created_at).toLocaleString()} &middot;{" "}
            {chat.messages.length} messages
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-chat-bg rounded-2xl border border-card-border p-4 space-y-4 shadow-sm">
        {chat.messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-5xl mb-3">🤷</div>
            <p className="text-muted">No messages in this session</p>
          </div>
        ) : (
          chat.messages.map((msg) => {
            const isUser = msg.role === "user";
            const cleanContent = msg.content
              .replace(/\[ORDER_CONFIRMED:\s*.+?\s*\|\s*.+?\s*\|\s*.+?\s*\]/, "")
              .replace(/\[ORDER_CONFIRMED:\s*.+?\s*\|\s*.+?\s*\]/, "")
              .trim();

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUser
                      ? "bg-primary text-white"
                      : "bg-sidebar text-white"
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
                  {isUser ? cleanContent : formatMarkdown(cleanContent)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
