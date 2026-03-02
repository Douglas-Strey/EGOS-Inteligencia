import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { sendChatMessage, type ChatEntityCard, type ChatResponse } from "@/api/client";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  entities?: ChatEntityCard[];
  suggestions?: string[];
  loading?: boolean;
}

const ENTITY_TYPE_COLORS: Record<string, string> = {
  company: "#3b82f6",
  person: "#8b5cf6",
  contract: "#f59e0b",
  sanction: "#ef4444",
  publicoffice: "#10b981",
  embargo: "#f97316",
  convenio: "#06b6d4",
  election: "#ec4899",
  finance: "#84cc16",
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  company: "Empresa",
  person: "Pessoa",
  contract: "Contrato",
  sanction: "Sanção",
  publicoffice: "Cargo Público",
  embargo: "Embargo",
  convenio: "Convênio",
  election: "Eleição",
  finance: "Financeiro",
};

export function ChatInterface({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(embedded);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        text: "Olá! Sou o assistente do **EGOS Inteligência**.\n\nPosso ajudar você a pesquisar empresas, contratos, sanções e conexões em dados públicos brasileiros.\n\nExperimente perguntar sobre uma empresa ou CNPJ.",
        suggestions: [
          "Pesquisar empresa por CNPJ",
          "Buscar sanções recentes",
          "Ver estatísticas do grafo",
        ],
      }]);
    }
  }, [isOpen, messages.length]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: msg,
    };

    const loadingMsg: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: "assistant",
      text: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(msg);
      setMessages((prev) =>
        prev.filter((m) => !m.loading).concat({
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: response.reply,
          entities: response.entities,
          suggestions: response.suggestions,
        }),
      );
    } catch {
      setMessages((prev) =>
        prev.filter((m) => !m.loading).concat({
          id: `error-${Date.now()}`,
          role: "assistant",
          text: "Desculpe, houve um erro. Tente novamente.",
          suggestions: ["Tentar novamente"],
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleEntityClick = useCallback((entity: ChatEntityCard) => {
    navigate(`/app/analysis/${entity.id}`);
  }, [navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  // Floating button mode
  if (!embedded && !isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        style={{
          position: "fixed", bottom: 80, right: 16, zIndex: 100,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
        }}
      >
        <MessageCircle size={24} color="white" />
      </button>
    );
  }

  const containerStyle: React.CSSProperties = embedded
    ? {
        width: "100%", maxWidth: 480, margin: "0 auto",
        display: "flex", flexDirection: "column",
        height: "min(70vh, 600px)",
        background: "var(--color-surface, #0f172a)",
        borderRadius: 16, border: "1px solid var(--color-border, #1e293b)",
        overflow: "hidden",
      }
    : {
        position: "fixed", bottom: 80, right: 16, zIndex: 100,
        width: "min(400px, calc(100vw - 32px))", height: "min(70vh, 600px)",
        display: "flex", flexDirection: "column",
        background: "var(--color-surface, #0f172a)",
        borderRadius: 16, border: "1px solid var(--color-border, #1e293b)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        overflow: "hidden",
      };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: "1px solid var(--color-border, #1e293b)",
        background: "var(--color-surface-elevated, #1e293b)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color="#3b82f6" />
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text, #e2e8f0)" }}>
            EGOS Inteligência
          </span>
        </div>
        {!embedded && (
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <X size={18} color="var(--color-text-secondary, #94a3b8)" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: 16,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
          }}>
            {msg.loading ? (
              <div style={{
                padding: "10px 14px", borderRadius: 12,
                background: "var(--color-surface-elevated, #1e293b)",
                color: "var(--color-text-secondary, #94a3b8)",
                fontSize: 13,
              }}>
                <span style={{ animation: "pulse 1.5s infinite" }}>Pesquisando...</span>
              </div>
            ) : (
              <>
                <div
                  style={{
                    padding: "10px 14px", borderRadius: 12, fontSize: 13, lineHeight: 1.5,
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                      : "var(--color-surface-elevated, #1e293b)",
                    color: msg.role === "user" ? "white" : "var(--color-text, #e2e8f0)",
                  }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                />

                {/* Entity cards */}
                {msg.entities && msg.entities.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    {msg.entities.map((entity) => (
                      <button
                        key={entity.id}
                        onClick={() => handleEntityClick(entity)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "8px 12px", borderRadius: 8,
                          background: "var(--color-surface, #0f172a)",
                          border: `1px solid ${ENTITY_TYPE_COLORS[entity.type] ?? "#334155"}`,
                          cursor: "pointer", textAlign: "left", width: "100%",
                        }}
                      >
                        <span style={{
                          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                          color: ENTITY_TYPE_COLORS[entity.type] ?? "#94a3b8",
                          minWidth: 60,
                        }}>
                          {ENTITY_TYPE_LABELS[entity.type] ?? entity.type}
                        </span>
                        <span style={{
                          fontSize: 12, color: "var(--color-text, #e2e8f0)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {entity.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        style={{
                          padding: "4px 10px", borderRadius: 12, fontSize: 11,
                          background: "transparent",
                          border: "1px solid var(--color-border, #334155)",
                          color: "var(--color-text-secondary, #94a3b8)",
                          cursor: "pointer", whiteSpace: "nowrap",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 16px", borderTop: "1px solid var(--color-border, #1e293b)",
        background: "var(--color-surface-elevated, #1e293b)",
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="CNPJ ou nome da empresa..."
          disabled={isLoading}
          style={{
            flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: 14,
            background: "var(--color-surface, #0f172a)",
            border: "1px solid var(--color-border, #334155)",
            color: "var(--color-text, #e2e8f0)",
            outline: "none",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: input.trim() ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "var(--color-surface, #0f172a)",
            border: "none", cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
}
