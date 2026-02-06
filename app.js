const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const projects = [];

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/my-project", (req, res) => {
  res.render("my-project", { projects });
});

app.get("/my-project/:id", (req, res) => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.send("Project tidak ditemukan");
  }

  res.render("detail", { project });
});

app.post("/my-project", (req, res) => {
  const { projectName, startDate, endDate, description } = req.body;

  const newProject = {
    id: projects.length + 1,
    name: projectName,
    startDate,
    endDate,
    description,
  };

  projects.push(newProject);
  res.redirect("/my-project");
});

app.get("/my-project/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return res.send("Project tidak ditemukan");
  }

  res.render("edit", { project });
});

app.post("/my-project/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const { projectName, startDate, endDate, description } = req.body;

  const project = projects.find((p) => p.id === id);

  if (project) {
    project.name = projectName;
    project.startDate = startDate;
    project.endDate = endDate;
    project.description = description;
  }

  res.redirect("/my-project");
});

app.post("/my-project/:id/delete", (req, res) => {
  const id = Number(req.params.id);
  const index = projects.findIndex((p) => p.id === id);

  if (index !== -1) {
    projects.splice(index, 1);
  }

  res.redirect("/my-project");
});

app.get("/contact", (req, res) => {
  res.render("contact", { projects });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
