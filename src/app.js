import express from "express";
import session from "express-session";
import path from "path";
import passport from "passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./lib/prisma.js";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const app = express();

dotenv.config();

// Routes
import { authRoutes } from "./routes/authRoutes.js";
import { fileRoutes } from "./routes/fileRoutes.js";
import { folderRoutes } from "./routes/folderRoutes.js";

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      dbRecordIdIsSessionId: true,
      tableName: "Session",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport LocalStrategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) return done(null, false, { message: "Incorrect username" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // store the member_id in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});

// Mount Routes
app.use("/", authRoutes);
app.use("/folders", folderRoutes);
app.use("/files", fileRoutes);

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

export default app;
