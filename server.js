/**
 * Imports
 */
import configNodeEnv from "./src/middleware/node-env.js";
import express from "express";
import fileUploads from "./src/middleware/file-uploads.js";

//FLASH MESSAGES AND SESSION
import session from "express-session";
import pgSession from "connect-pg-simple";
import flashMessages from "./src/middleware/flash-messages.js";
import pg from "pg";
const { Pool } = pg;
import layouts from "./src/middleware/layouts.js";
import path from "path";
import { configureStaticPaths } from "./src/utils/index.js";
import { fileURLToPath } from "url";
import { setupDatabase } from "./src/models/index.js";
//ROUTES
import homeRoute from "./src/routes/index.js";
import categoryRoute from "./src/routes/category/category.js";
import loginRoute from "./src/routes/account/login.js";
import registerRoute from "./src/routes/account/register.js";
import accountRoute from "./src/routes/account/account.js";
import dashboardRoute from "./src/routes/dashboard/dashboard.js";
import contactRoute from "./src/routes/contact/contact.js";
import tasksRoute from "./src/routes/tasks/tasks.js";
import cartRoute from "./src/routes/cart/cart.js";
import createTicket from "./src/routes/tickets/tickets.js";
import soapRoute from "./src/routes/soaps/soap.js";

/**
 * Global Variables
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mode = process.env.NODE_ENV;
const port = process.env.PORT;

/**
 * Create and configure the Express server
 */
const app = express();

// Configure session middleware and flash messages
const pgPool = new Pool({
  // PostgreSQL connection pool
  connectionString: process.env.DB_URL,
});
app.use(
  session({
    store: new (pgSession(session))({
      pool: pgPool, //stores sessions in PostgreSQL
      tableName: "session", // Default table name for storing sessions
    }),
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Configure the application based on environment settings
app.use(configNodeEnv);

// Configure static paths (public dirs) for the Express application
configureStaticPaths(app);

// Set EJS as the view engine and record the location of the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set("layout default", "default");
app.set("layouts", path.join(__dirname, "src/views/layouts"));
app.use(layouts);

// Middleware to process multipart form data with file uploads
app.use(fileUploads);
// Middleware to parse JSON data in request body
app.use(express.json());
// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

app.use(flashMessages);
/**
 * Routes
 */

app.use("/", homeRoute);
app.use("/category", categoryRoute);
app.use("/soap", soapRoute);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/account", accountRoute);
app.use("/dashboard", dashboardRoute);
app.use("/contact", contactRoute);
app.use("/tasks", tasksRoute);
app.use("/cart", cartRoute);
app.use("/tickets", createTicket);

/**
 * Start the server
 */

// When in development mode, start a WebSocket server for live reloading
if (mode.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(port) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the Express server
app.listen(port, async () => {
  //await testDatabase();
  await setupDatabase();
  console.log(`Server running on http://127.0.0.1:${port}`);
});
