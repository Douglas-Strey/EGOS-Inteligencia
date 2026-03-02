import { useEffect, useState } from "react";
import styles from "./Analytics.module.css";

interface AnalyticsData {
  today: {
    date: string;
    page_views: Record<string, number>;
    total_views: number;
    unique_visitors: number;
    hourly: Record<string, number>;
  };
  total_all_time: number;
  last_7_days: Record<string, number>;
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/analytics/summary")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.container}><p>Carregando analytics...</p></div>;
  if (!data) return <div className={styles.container}><p>Erro ao carregar analytics</p></div>;

  const maxDaily = Math.max(...Object.values(data.last_7_days), 1);

  // Aggregate entity analysis pages into a single group
  const aggregatedPages: Record<string, number> = {};
  for (const [page, views] of Object.entries(data.today.page_views)) {
    if (page.startsWith("/app/analysis/")) {
      aggregatedPages["/app/analysis/* (entidades)"] = (aggregatedPages["/app/analysis/* (entidades)"] || 0) + views;
    } else if (page.startsWith("/app/graph/")) {
      aggregatedPages["/app/graph/* (grafos)"] = (aggregatedPages["/app/graph/* (grafos)"] || 0) + views;
    } else {
      aggregatedPages[page] = (aggregatedPages[page] || 0) + views;
    }
  }
  const sortedPages = Object.entries(aggregatedPages).sort(([, a], [, b]) => b - a).slice(0, 20);
  const sortedHours = Object.entries(data.today.hourly).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Analytics</h1>
      <p className={styles.subtitle}>
        Dados reais coletados desde o último restart da API (in-memory Redis). Dias anteriores sem dados indicam restart do container.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Visualizações Hoje</div>
          <div className={styles.cardValue}>{data.today.total_views}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Visitantes Únicos</div>
          <div className={styles.cardValue}>{data.today.unique_visitors}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Total All-Time</div>
          <div className={styles.cardValue}>{data.total_all_time}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Data</div>
          <div className={styles.cardValue}>{data.today.date}</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Últimos 7 Dias</h2>
      <div className={styles.chartContainer}>
        {Object.entries(data.last_7_days)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, views]) => (
            <div key={date} className={styles.barGroup}>
              <div className={styles.barLabel}>{date.slice(5)}</div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${(views / maxDaily) * 100}%` }}
                />
              </div>
              <div className={styles.barValue}>{views}</div>
            </div>
          ))}
      </div>

      {sortedHours.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Distribuição por Hora (Hoje)</h2>
          <div className={styles.chartContainer}>
            {sortedHours.map(([hour, count]) => (
              <div key={hour} className={styles.barGroup}>
                <div className={styles.barLabel}>{hour}h</div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${(count / Math.max(...sortedHours.map(([, c]) => c), 1)) * 100}%` }}
                  />
                </div>
                <div className={styles.barValue}>{count}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {sortedPages.length > 0 && (
        <>
          <h2 className={styles.sectionTitle}>Páginas Mais Visitadas (Hoje)</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Página</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {sortedPages.map(([page, views]) => (
                  <tr key={page}>
                    <td className={styles.pagePath}>{page}</td>
                    <td>{views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
