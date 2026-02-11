const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const session = require("express-session");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const hbs = require("hbs");

hbs.registerHelper("includes", function (array, value) {
  return array && array.includes(value);
});

const app = express();
const uploadPath = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
const PORT = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "personal-web-secret",
    resave: false,
    saveUninitialized: false,
  })
);

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

const pool = new Pool({
  user: "postgres",
  password: "thakr4wqe",
  host: "localhost",
  database: "personal_web",
  port: 5432,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.send("Email tidak ditemukan");
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.send("Password salah");
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  res.redirect("/my-project");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
    [name, email, hashedPassword]
  );

  res.redirect("/");
});

app.get("/my-project", isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;

  const result = await pool.query(
    "SELECT * FROM projects WHERE user_id = $1",
    [userId]
  );

const projects = result.rows.map((p) => ({
  id: p.id,
  name: p.title,
  startDate: p.start_date,
  endDate: p.end_date,
  description: p.description,
  image: p.image,
}));

  res.render("my-project", {
    projects,
    user: req.session.user,
  });
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

app.post("/my-project", isAuthenticated, upload.single("image"), async (req, res) => {
  const { projectName, startDate, endDate, description } = req.body;
  const userId = req.session.user.id;

  const image = req.file ? "/uploads/" + req.file.filename : null;

  await pool.query(
    `INSERT INTO projects (user_id, title, start_date, end_date, description, image)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, projectName, startDate || null, endDate || null, description, image]
  );

  res.redirect("/my-project");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
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

app.post("/my-project/:id/edit", isAuthenticated, upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { projectName, startDate, endDate, description } = req.body;

  const existing = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );

  let image = existing.rows[0].image;

  if (req.file) {
    image = "/uploads/" + req.file.filename;
  }

  await pool.query(
    `UPDATE projects
     SET title=$1, start_date=$2, end_date=$3, description=$4, image=$5
     WHERE id=$6`,
    [projectName, startDate || null, endDate || null, description, image, id]
  );

  res.redirect("/my-project");
});

app.post("/my-project/:id/delete", isAuthenticated, async (req, res) => {
  const id = Number(req.params.id);

  const result = await pool.query("SELECT image FROM projects WHERE id=$1", [id]);

  const imagePath = result.rows[0]?.image;

  if (imagePath) {
    const fullPath = path.join(__dirname, "public", imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  await pool.query("DELETE FROM projects WHERE id=$1", [id]);

  res.redirect("/my-project");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
