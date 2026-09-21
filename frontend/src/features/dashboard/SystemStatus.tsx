import React, { useEffect, useState } from "react";
import { healthApi } from "../../services/api-client";

export const SystemStatus = ({ status }: { status?: string }): React.ReactElement => {
  const [health, setHealth] = useState<"loading" | "healthy" | "unavailable">("loading");

  useEffect(() => {
    let active = true;
    healthApi()
      .then(() => {
        if (active) setHealth("healthy");
      })
      .catch(() => {
        if (active) setHealth("unavailable");
      });

    return () => {
      active = false;
    };
  }, []);

  const label = health === "loading"
    ? "Checking backend"
    : health === "healthy"
      ? "Backend connected"
      : "Backend unavailable";

  const displayStatus = health === "loading"
    ? "Checking system status..."
    : health === "healthy"
      ? (status ?? "Operational")
      : "Status unavailable";

  const dotClass = health === "healthy"
    ? "status-dot status-success"
    : "status-dot status-neutral";

  return (
    <section className="dashboard-lead surface">
      <div className="section-heading">
        <div>
          <p className="eyebrow">System status</p>
          <h2>{displayStatus}</h2>
        </div>
        <span className="status-badge">
          <span className={dotClass} />
          {label}
        </span>
      </div>
      <p className="muted">
        {health === "healthy"
          ? "Operational state is confirmed by the backend health service."
          : health === "loading"
            ? "Checking the backend health service."
            : "The backend health service could not be reached."}
      </p>
    </section>
  );
};