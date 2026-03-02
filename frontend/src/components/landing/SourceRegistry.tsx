import { useEffect, useState } from "react";

interface Source {
  id: string;
  name: string;
  category: string;
  tier: string;
  status: string;
  implemented: boolean;
  loaded: boolean;
  healthy: boolean;
  frequency: string;
  url: string;
  access_mode: string;
  notes: string;
}

interface SourcesData {
  total: number;
  implemented: number;
  loaded: number;
  healthy: number;
  categories: Record<string, { total: number; loaded: number }>;
  sources: Source[];
}

const TIER_COLORS: Record<string, string> = {
  P0: "#ef4444",
  P1: "#f59e0b",
  P2: "#3b82f6",
  P3: "#6b7280",
};

const CAT_LABELS: Record<string, string> = {
  identity: "Identidade",
  electoral: "Eleitoral",
  contracts: "Contratos",
  sanctions: "Sancoes",
  finance: "Financeiro",
  fiscal: "Fiscal",
  legislative: "Legislativo",
  judiciary: "Judiciario",
  health: "Saude",
  education: "Educacao",
  environment: "Meio Ambiente",
  labor: "Trabalho",
  spending: "Gastos Publicos",
  transfers: "Transferencias",
  offshore: "Offshore",
  market: "Mercado",
  gazette: "Diario Oficial",
  audit: "Auditoria",
  integrity: "Integridade",
  international: "Internacional",
  ownership: "Propriedade",
  regulatory: "Regulatorio",
  state: "Estadual",
  municipal: "Municipal",
  budget: "Orcamento",
  social: "Social",
  tax: "Tributario",
};

export function SourceRegistry() {
  const [data, setData] = useState<SourcesData | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/updates/sources.json")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => null);
  }, []);

  if (!data) return null;

  const filtered =
    filter === "all"
      ? data.sources
      : filter === "loaded"
        ? data.sources.filter((s) => s.loaded)
        : filter === "pending"
          ? data.sources.filter((s) => !s.loaded)
          : data.sources.filter((s) => s.category === filter);

  const categories = Object.entries(data.categories).sort(
    (a, b) => b[1].loaded - a[1].loaded
  );

  return (
    <section style={{ padding: "2rem 1.5rem", maxWidth: 1000, margin: "0 auto" }}>
      <span
        style={{
          display: "block",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#94a3b8",
          marginBottom: "0.5rem",
        }}
      >
        Transparencia Total
      </span>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>
        {data.total} Fontes de Dados Publicos
      </h2>
      <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1.5rem" }}>
        Todas as fontes sao publicas, verificaveis e com links diretos. Zero caixa preta.
      </p>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {[
          { label: "Total", value: data.total, color: "#f1f5f9" },
          { label: "Implementadas", value: data.implemented, color: "#22c55e" },
          { label: "Carregadas", value: data.loaded, color: "#3b82f6" },
          { label: "Saudaveis", value: data.healthy, color: "#10b981" },
          { label: "Pendentes", value: data.total - data.loaded, color: "#f59e0b" },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              textAlign: "center",
              padding: "0.75rem 1rem",
              background: "rgba(30,41,59,0.7)",
              borderRadius: 8,
              border: "1px solid rgba(71,85,105,0.3)",
              minWidth: 80,
            }}
          >
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: m.color, display: "block" }}>
              {m.value}
            </span>
            <span style={{ fontSize: "0.625rem", color: "#64748b", textTransform: "uppercase" }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {[
          { key: "all", label: "Todas" },
          { key: "loaded", label: "Carregadas" },
          { key: "pending", label: "Pendentes" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setExpanded(true); }}
            style={{
              fontSize: "0.6875rem",
              padding: "0.25rem 0.625rem",
              borderRadius: 6,
              border: filter === f.key ? "1px solid #3b82f6" : "1px solid rgba(71,85,105,0.3)",
              background: filter === f.key ? "#1e40af" : "transparent",
              color: filter === f.key ? "#fff" : "#94a3b8",
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {categories.map(([cat, counts]) => (
          <button
            key={cat}
            onClick={() => { setFilter(cat); setExpanded(true); }}
            style={{
              fontSize: "0.5625rem",
              padding: "0.125rem 0.5rem",
              borderRadius: 999,
              border: filter === cat ? "1px solid #3b82f6" : "1px solid rgba(71,85,105,0.2)",
              background: filter === cat ? "#1e3a5f" : "transparent",
              color: filter === cat ? "#93c5fd" : "#64748b",
              cursor: "pointer",
            }}
          >
            {CAT_LABELS[cat] || cat} ({counts.loaded}/{counts.total})
          </button>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          fontSize: "0.75rem",
          color: "#3b82f6",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: "0.75rem",
          padding: 0,
        }}
      >
        {expanded ? "Recolher lista" : `Ver todas as ${filtered.length} fontes`} {expanded ? "\u25B2" : "\u25BC"}
      </button>

      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {filtered.map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(15,23,42,0.5)",
                borderRadius: 6,
                border: "1px solid rgba(71,85,105,0.2)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: s.healthy ? "#22c55e" : s.loaded ? "#3b82f6" : s.implemented ? "#f59e0b" : "#475569",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.5625rem",
                  padding: "0 0.375rem",
                  borderRadius: 4,
                  background: `${TIER_COLORS[s.tier] || "#475569"}20`,
                  color: TIER_COLORS[s.tier] || "#94a3b8",
                  border: `1px solid ${TIER_COLORS[s.tier] || "#475569"}40`,
                  flexShrink: 0,
                }}
              >
                {s.tier}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: "0.8125rem", color: "#e2e8f0", fontWeight: 500 }}>
                  {s.name}
                </span>
                <span style={{ fontSize: "0.625rem", color: "#475569", marginLeft: "0.5rem" }}>
                  {CAT_LABELS[s.category] || s.category}
                </span>
              </div>
              <span style={{ fontSize: "0.5625rem", color: "#475569" }}>
                {s.access_mode}
              </span>
              {s.url && (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.625rem",
                    color: "#3b82f6",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                  title={s.url}
                >
                  Link
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
