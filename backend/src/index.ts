import { createApp } from "./app/app.js";
import { config } from "./app/config.js";

const app = createApp();

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, config.host, () => {
    console.log(`JARVIS backend listening on ${config.host}:${config.port}`);
  });
}

export { app };
