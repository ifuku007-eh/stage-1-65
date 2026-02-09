const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const hbs = require("hbs");

hbs.registerHelper("includes", function (array, value) {
  return array && array.includes(value);
});

const app = express();
const PORT = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  password: "thakr4wqe",
  host: "localhost",
  database: "personal_web",
  port: 5432,
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/my-project", async (req, res) => {
  const result = await pool.query("SELECT * FROM projects");

  const projects = result.rows.map((p) => ({
    id: p.id,
    name: p.name,
    startDate: p.start_date,
    endDate: p.end_date,
    description: p.description,
  }));

  res.render("my-project", { projects });
});

app.get("/my-project/:id", async (req, res) => {
  const id = Number(req.params.id);

  const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.send("Project tidak ditemukan");
  }

  const p = result.rows[0];

  res.render("detail", {
    project: {
      id: p.id,
      name: p.name,
      startDate: p.start_date,
      endDate: p.end_date,
      description: p.description,
    },
  });
});

app.post("/my-project", async (req, res) => {
  let { projectName, startDate, endDate, description } = req.body;

  startDate = startDate || null;
  endDate = endDate || null;

  await pool.query(
    `INSERT INTO projects (title, start_date, end_date, description)
     VALUES ($1, $2, $3, $4)`,
    [projectName, startDate, endDate, description]
  );

  res.redirect("/my-project");
});

app.get("/my-project/:id/edit", async (req, res) => {
  const id = Number(req.params.id);

  const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    return res.send("Project tidak ditemukan");
  }

  const p = result.rows[0];

  res.render("edit", {
    project: {
      id: p.id,
      name: p.name,
      startDate: p.start_date,
      endDate: p.end_date,
      description: p.description,
    },
  });
});

app.post("/my-project/:id/edit", async (req, res) => {
  const { id } = req.params;
  let { projectName, startDate, endDate, description } = req.body;

  startDate = startDate || null;
  endDate = endDate || null;

  await pool.query(
    `UPDATE projects
     SET title=$1, start_date=$2, end_date=$3, description=$4
     WHERE id=$5`,
    [projectName, startDate, endDate, description, id]
  );

  res.redirect("/my-project");
});

app.post("/my-project/:id/delete", async (req, res) => {
  const id = Number(req.params.id);

  await pool.query("DELETE FROM projects WHERE id = $1", [id]);

  res.redirect("/my-project");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
