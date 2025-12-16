// app.js
import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";

const app = express();

/* view engine */
app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", ".hbs");
app.set("views", "./views");

/* middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

/* routes */
app.use(authRoutes);
app.use(projectRoutes);

/* default */
app.get("/", (_, res) => res.redirect("/register"));

export default app;
