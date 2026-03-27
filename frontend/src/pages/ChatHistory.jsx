import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { MessageSquare, ChevronRight } from "lucide-react";

export default function ChatHistory() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/chat/history")
      .then(({ data }) => setChats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Chat History</h1>
      <p className="text-muted text-sm mb-6">
        View your past conversations
      </p>
      {chats.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900">No chats yet</h3>
          <p className="text-muted mt-1">
            Start ordering food to see your conversations here!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/history/${chat.id}`)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-card-border hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MessageSquare size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Chat Session #{chat.id}
                  </h3>
                  <p className="text-sm text-muted">
                    {new Date(chat.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-muted">
                    {chat.messages?.length || 0} messages
                  </span>
                  <ChevronRight size={16} className="text-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
