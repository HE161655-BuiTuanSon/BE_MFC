import express from "express";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js"; // đảm bảo đúng đường dẫn

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());

import authRoutes from "./routes/auth.routes.js";
app.use("/auth", authRoutes);
import userRoutes from "./routes/user.routes.js";
app.use("/api", userRoutes);

export default app;
