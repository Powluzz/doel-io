import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // Seed demo user
  const { storage } = await import("./storage");
  const crypto = await import("crypto");
  const existing = await storage.getUserByEmail("demo@doel.ai");
  if (!existing) {
    const demo = await storage.createUser({
      email: "demo@doel.ai",
      passwordHash: crypto.createHash("sha256").update("demo123doel-ai-salt").digest("hex"),
      name: "Demo Gebruiker",
    });
    const goal = await storage.createGoal({
      userId: demo.id,
      title: "Minder piekeren over werk",
      category: "werk",
      description: null,
    });
    await storage.createGEntry({
      userId: demo.id,
      goalId: goal.id,
      event: "Mijn leidinggevende stuurde laat op de avond een mail",
      thoughts: "Ik moet altijd bereikbaar zijn, anders faal ik",
      feelings: [{ label: "gespannen", intensity: 75 }, { label: "bedroefd", intensity: 40 }],
      behaviour: "Ik heb meteen gereageerd, ook al was het al 22:00",
      consequence: "Even opgelucht, maar sliep daarna slecht",
      helpfulThought: "Ik mag grenzen stellen en morgen reageren",
      helpsGoal: "nee",
      contextTags: ["werk", "avond"],
      timestamp: new Date(),
    });
    await storage.createAction({
      userId: demo.id,
      goalId: goal.id,
      ifSituation: "ik een mail ontvang na 20:00",
      thenBehaviour: "lees ik hem, maar beantwoord ik hem pas de volgende ochtend",
      status: "planned",
    });
  }

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
