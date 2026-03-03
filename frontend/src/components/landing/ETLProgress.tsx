import { useEffect, useState } from "react";

interface ETLData {
  running: boolean;
  phase: number | null;
  current_file: string | null;
  files_processed: number;
  total_files: number;
  percent: number;
  last_update: string | null;
  phases: Record<string, string>;
}

interface StatsData {
  total_nodes: number;
  total_relationships: number;
  data_sources: number;
  implemented_sources: number;
  loaded_sources: number;
}

export function ETLProgress() {
  const [data, setData] = useState<ETLData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchProgress = () => {
      fetch("/api/v1/meta/etl-progress")
        .then((r) => (r.ok ? r.json() : null))
        .then(setData)
        .catch(() => null);
    };
    const fetchStats = () => {
      fetch("/api/v1/meta/stats")
        .then((r) => (r.ok ? r.json() : null))
        .then(setStats)
        .catch(() => null);
    };
    fetchProgress();
    fetchStats();
    const interval = setInterval(fetchProgress, 30000);
    return () => clearInterval(interval);
  }, []);

  const etlRunning = data?.running === true;
  const hasData = stats && stats.total_nodes > 0;

  // Always show — either ETL status or data status
  if (!data && !stats) return null;

  const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

  // If ETL is running, show ETL progress
  if (etlRunning && data) {
    const phaseLabel = data.phase ? data.phases[String(data.phase)] || `Fase ${data.phase}` : "Iniciando...";
    return (
      <div style={{ margin: "1rem auto", maxWidth: 600, padding: "1rem 1.25rem", background: "rgba(15,23,42,0.6)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s infinite", flexShrink: 0 }} />
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>ETL em andamento</span>
        </div>
        <div style={{ fontSize: "0.8125rem", color: "#e2e8f0", marginBottom: "0.5rem" }}>Fase {data.phase}/4: {phaseLabel}</div>
        <div style={{ height: 6, background: "rgba(30,41,59,0.8)", borderRadius: 3, overflow: "hidden", marginBottom: "0.375rem" }}>
          <div style={{ height: "100%", width: `${Math.min(data.percent, 100)}%`, background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 3, transition: "width 1s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.625rem", color: "#64748b" }}>
          <span>Arquivos: {data.files_processed}/{data.total_files}</span>
          <span>{data.percent.toFixed(1)}%</span>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  }

  // Otherwise: show data status (always visible)
  return (
    <div
      style={{
        margin: "1rem auto",
        maxWidth: 600,
        padding: "1rem 1.25rem",
        background: "rgba(15,23,42,0.6)",
        borderRadius: 10,
        border: "1px solid rgba(71,85,105,0.2)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: hasData ? "#10b981" : "#64748b", flexShrink: 0 }} />
        <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {hasData ? "Grafo Ativo" : "Dados Indisponíveis"}
        </span>
      </div>

      {hasData && stats ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e2e8f0" }}>{fmtK(stats.total_nodes)}</div>
            <div style={{ fontSize: "0.625rem", color: "#64748b" }}>Entidades</div>
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e2e8f0" }}>{fmtK(stats.total_relationships)}</div>
            <div style={{ fontSize: "0.625rem", color: "#64748b" }}>Conexões</div>
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#e2e8f0" }}>{stats.data_sources}</div>
            <div style={{ fontSize: "0.625rem", color: "#64748b" }}>Fontes</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
          Nenhum dado carregado. O ETL ainda não foi executado.
        </div>
      )}
    </div>
  );
}
