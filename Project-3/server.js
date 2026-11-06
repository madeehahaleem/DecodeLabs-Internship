const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());

// Email check karne ka regex (Project 2 jaisa)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Name aur email ko check karne wala function
function validateUser(body) {
  const { name, email } = body;
  if (!name || !email) return "Name and email are required";
  if (typeof name !== "string" || name.trim() === "") return "Invalid name";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
}

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Project 3 - Database Integration");
});

// CREATE: naya user save karo
app.post("/users", (req, res) => {
  const error = validateUser(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const result = db
      .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
      .run(req.body.name.trim(), req.body.email);
    res.status(201).json({
      id: result.lastInsertRowid,
      name: req.body.name.trim(),
      email: req.body.email,
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// READ: saare users dikhao
app.get("/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

// READ: ek user dikhao
app.get("/users/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// UPDATE: user ki detail badlo
app.put("/users/:id", (req, res) => {
  const error = validateUser(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const result = db
      .prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")
      .run(req.body.name.trim(), req.body.email, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated" });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
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
  console.log("Server running on http://localhost:"+PORT);
});