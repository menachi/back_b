import express, { Express } from "express";
import mongoose from "mongoose";
import moviesRoute from "./routes/moviesRoute";
import commentsRoute from "./routes/commentsRoute";
import authRoute from "./routes/authRoute";
import { swaggerUi, swaggerSpec } from "./swagger";
import multerRoute from "./routes/multerRoute";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const app = express();
app.use(express.json());

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Movies & Comments API Documentation'
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});
// API routes
app.use("/movie", moviesRoute);
app.use("/comment", commentsRoute);
app.use("/auth", authRoute);
app.use('/uploads', express.static('public/uploads'));
app.use("/upload", multerRoute);

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const initApp = () => {
  const pr = new Promise<Express>((resolve, reject) => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      reject("DATABASE_URL is not defined");
      return;
    }
    mongoose
      .connect(dbUrl, {})
      .then(() => {
        resolve(app);
      });
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
  });
  return pr;
};

export default initApp;
