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

// POST /transactions
app.post("/transactions", (req, res) => {
  const { userId, amount, category, date } = req.body;
  if (!userId || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.run(
    `INSERT INTO transactions (userId, amount, category, date) VALUES (?, ?, ?, ?)`,
    [userId, amount, category, date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to save transaction" });
      }
      res.status(201).json({ id: this.lastID, userId, amount, category, date });
    }
  );
});

// GET /transactions/:userId
app.get("/transactions/:userId", (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT * FROM transactions WHERE userId = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch transactions" });
      }
      res.json(rows);
    }
  );
});

// PUT /transactions/:id
app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { amount, category, date } = req.body;
  if (!amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.run(
    `UPDATE transactions SET amount = ?, category = ?, date = ? WHERE id = ?`,
    [amount, category, date, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to update transaction" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json({ id, amount, category, date });
    }
  );
});

// DELETE /transactions/:id
app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Failed to delete transaction" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  });
});

// Basic route
app.get("/", (req, res) => res.send("Backend running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
