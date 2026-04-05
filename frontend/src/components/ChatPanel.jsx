import { MessageSquareText, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function ChatPanel({
  isOpen,
  onToggle,
  messages,
  onSend,
  loading,
  onOrderConfirm,
}) {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <MessageSquareText size={24} />
      </button>
    );
  }

  return (
    <>
      {/* Mobile: full-screen overlay */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquareText size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-[11px] text-muted">Ask me to help you order</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-input-bg transition-colors text-muted"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow
            messages={messages}
            onSend={onSend}
            loading={loading}
            onOrderConfirm={onOrderConfirm}
          />
        </div>
      </div>

      {/* Desktop: side panel */}
      <div className="hidden md:flex w-95 shrink-0 border-l border-card-border bg-card flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-card-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <MessageSquareText size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-[11px] text-muted">Ask me to help you order</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-input-bg transition-colors text-muted"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow
            messages={messages}
            onSend={onSend}
            loading={loading}
            onOrderConfirm={onOrderConfirm}
          />
        </div>
      </div>
    </>
  );
}
