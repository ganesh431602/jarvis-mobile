import React from "react";
export const AgentActivity = ({ count }: { count?: number }): React.ReactElement => <section className="surface"><p className="eyebrow">Agents</p><h2>{count === undefined ? "Activity unavailable" : `${count} active`}</h2><p className="muted">Agent status is supplied by the backend registry.</p></section>;
