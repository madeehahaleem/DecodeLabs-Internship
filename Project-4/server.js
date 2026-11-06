const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3000;

// CORS: frontend ko backend se baat karne ki ijazat deta hai
app.use(cors());
app.use(express.json());

// Email check karne ka regex (Project 2 jaisa)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Project 4 - Frontend and Backend Integration");
});

// READ: saare users dikhao
app.get("/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

// CREATE: naya user save karo
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Invalid name" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const result = db
      .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
      .run(name.trim(), email);
    res.status(201).json({
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: email,
    });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE: user hatao
app.delete("/users/:id", (req, res) => {
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ message: "User deleted" });
});

// Unknown routes ke liye 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});