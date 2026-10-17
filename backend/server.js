const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// Database file lives in the backend folder
const db = new Database("families.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    name TEXT,
    age_group TEXT,
    description TEXT,
    home_area TEXT,
    shelter TEXT,
    visibility TEXT DEFAULT 'ask_first',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Makes a short code like HAWK-4821 so people need no ID
function makeCode() {
  const words = ["HAWK", "PINE", "WAVE", "STAR", "MOSS", "REED", "DAWN", "FERN"];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return word + "-" + num;
}

app.get("/", (req, res) => {
  res.send("Reuniting Families backend is running!");
});

// CHECK IN a person (everything is optional)
app.post("/api/people", (req, res) => {
  const { name, age_group, description, home_area, shelter, visibility } = req.body;
  const allowed = ["findable", "ask_first", "safe_only"];
  const vis = allowed.includes(visibility) ? visibility : "ask_first";
  const code = makeCode();

  db.prepare(
    `INSERT INTO people (code, name, age_group, description, home_area, shelter, visibility)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(code, name || null, age_group || null, description || null,
        home_area || null, shelter || null, vis);

  res.json({ code, message: "Checked in. Give this code to the person." });
});



// SEARCH for a person (respects privacy choices)
app.get("/api/search", (req, res) => {
  const name = (req.query.name || "").trim().toLowerCase();
  const area = (req.query.area || "").trim().toLowerCase();

  if (!name) {
    return res.json({ results: [] });
  }

  const parts = name.split(/\s+/).filter(Boolean);
  const rows = db.prepare("SELECT * FROM people").all();

  const matches = rows.filter((p) => {
    const pName = (p.name || "").toLowerCase();
    const pArea = (p.home_area || "").toLowerCase();
    const nameOk = parts.some((part) => pName.includes(part));
    const areaOk = !area || pArea.includes(area);
    return nameOk && areaOk;
  });

  const results = matches.map((p) => {
    if (p.visibility === "findable") {
      return {
        status: "found",
        name: p.name,
        age_group: p.age_group,
        shelter: p.shelter,
        code: p.code,
      };
    }
    if (p.visibility === "ask_first") {
      return {
        status: "possible_match",
        message: "Someone may match. A volunteer will check with them and get back to you.",
      };
    }
    return { status: "safe", message: "This person has been confirmed safe." };
  });

  res.json({ results });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});