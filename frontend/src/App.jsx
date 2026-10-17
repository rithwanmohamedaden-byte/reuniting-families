import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function CheckIn() {
  const [form, setForm] = useState({
    name: "",
    age_group: "",
    description: "",
    home_area: "",
    shelter: "",
    visibility: "ask_first",
  });
  const [code, setCode] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async () => {
    const res = await fetch(API + "/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCode(data.code);
  };

  if (code) {
    return (
      <div>
        <h2>Checked in</h2>
        <p>Give this code to the person. Write it on a slip of paper:</p>
        <div className="code">{code}</div>
        <button onClick={() => { setCode(""); setForm({ ...form, name: "", age_group: "", description: "", home_area: "" }); }}>
          Check in next person
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Check in a person</h2>
      <p className="hint">Every field is optional. Don't push anyone to share more than they want to.</p>

      <label>Name or nickname</label>
      <input value={form.name} onChange={update("name")} />

      <label>Age group</label>
      <select value={form.age_group} onChange={update("age_group")}>
        <option value="">Not sure / prefer not to say</option>
        <option value="child">Child</option>
        <option value="teen">Teen</option>
        <option value="adult">Adult</option>
        <option value="elderly">Elderly</option>
      </select>

      <label>Description (clothing, features)</label>
      <input value={form.description} onChange={update("description")} />

      <label>Home neighborhood</label>
      <input value={form.home_area} onChange={update("home_area")} />

      <label>This shelter</label>
      <input value={form.shelter} onChange={update("shelter")} />

      <label>Who can find this person?</label>
      <select value={form.visibility} onChange={update("visibility")}>
        <option value="findable">Anyone searching can see where they are</option>
        <option value="ask_first">Ask me first (a volunteer checks with me)</option>
        <option value="safe_only">Only say that I am safe</option>
      </select>

      <button onClick={submit}>Check in</button>
    </div>
  );
}

function Search() {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [results, setResults] = useState(null);

  const search = async () => {
    const res = await fetch(
      API + "/api/search?name=" + encodeURIComponent(name) + "&area=" + encodeURIComponent(area)
    );
    const data = await res.json();
    setResults(data.results);
  };

  return (
    <div>
      <h2>Find someone</h2>
      <p className="hint">Search by a name or nickname. Adding their home neighborhood helps narrow it down.</p>

      <label>Name or nickname</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Home neighborhood (optional)</label>
      <input value={area} onChange={(e) => setArea(e.target.value)} />

      <button onClick={search}>Search</button>

      {results && results.length === 0 && (
        <p>No match yet. People are still checking in, so try again later.</p>
      )}

      {results && results.map((r, i) => (
        <div className="card" key={i}>
          {r.status === "found" && (
            <>
              <strong>{r.name}</strong>
              <div>Shelter: {r.shelter || "unknown"}</div>
              <div>Code: {r.code}</div>
            </>
          )}
          {r.status !== "found" && <div>{r.message}</div>}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("search");
  return (
    <div className="page">
      <h1>Reuniting Families</h1>
      <div className="tabs">
        <button className={tab === "search" ? "active" : ""} onClick={() => setTab("search")}>
          I'm looking for someone
        </button>
        <button className={tab === "checkin" ? "active" : ""} onClick={() => setTab("checkin")}>
          Shelter check-in
        </button>
      </div>
      {tab === "search" ? <Search /> : <CheckIn />}
    </div>
  );
}