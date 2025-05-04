const express = require("express");
const mongoose = require("mongoose");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// SQLite connection
const db = new sqlite3.Database("./transactions.db", (err) => {
  if (err) console.error("SQLite connection error:", err);
  else console.log("SQLite connected");
});

// Create transactions table
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    amount REAL,
    category TEXT,
    date TEXT
  )
`);

// Basic route
app.get("/", (req, res) => res.send("Backend running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
