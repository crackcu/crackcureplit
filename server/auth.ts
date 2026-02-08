import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Express } from "express";

const PgStore = connectPgSimple(session);

export function setupAuth(app: Express) {
  app.use(
    session({
      store: new PgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
    })
  );
}

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}
