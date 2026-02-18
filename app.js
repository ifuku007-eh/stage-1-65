require("dotenv").config(); // Load environment variables
const express = require("express"); // Framework utama
const path = require("path"); // Mengatur path folder
const { Pool } = require("pg"); // PostgreSQL client
const session = require("express-session"); // Session login
const methodOverride = require("method-override"); // Support PUT & DELETE
const bcrypt = require("bcrypt"); // Hash password
const hbs = require("hbs"); // Handlebars template engine
const multer = require("multer"); // Upload file

const app = express();
const PORT = process.env.PORT || 3000; // Port server

// ================= DATABASE CONNECTION =================
let pool;

if (process.env.NODE_ENV === "production") {
  // Railway
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Lokal
  pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "portfolio_web",
    password: "thakr4wqe",
    port: 5432,
    ssl: false,
  });
}


// ================= APP CONFIGURATION =================
app.set("view engine", "hbs"); // Set template engine
app.set("views", path.join(__dirname, "views")); // Folder views
app.set("view options", { layout: "layouts/dashboard" }); // Default layout

app.use(express.static(path.join(__dirname, "public"))); // Static folder
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method")); // Enable PUT & DELETE from form

// ================= SESSION CONFIG =================
app.use(
  session({
    secret: "portfolio-secret", // Secret key session
    resave: false,
    saveUninitialized: false,
  }),
);

// ================= MULTER (UPLOAD CONFIG) =================
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, "public/uploads"), // Folder upload
    filename: (_, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname), // Rename file
  }),
});

// ================= HANDLEBARS HELPERS =================
hbs.registerHelper("includes", (arr, val) => arr?.includes(val)); // Cek array
hbs.registerHelper("eq", (a, b) => a === b); // Cek sama dengan
hbs.registerHelper("truncate", (text, len) =>
  text?.length > len ? text.substring(0, len) + "..." : text,
); // Potong teks

// ================= GLOBAL SESSION (AVAILABLE IN ALL VIEWS) =================
app.use((req, res, next) => {
  res.locals.user = req.session.user; // Kirim user ke semua view
  res.locals.theme = req.session.theme || "light";
  next();
});

// ================= HERO ROLE DATA =================
const heroRoles = ["Roam", "Mid", "EXP", "Gold", "Jungle"];

// ================= MIDDLEWARE =================

// Cek apakah user login
const isAuth = (req, res, next) =>
  req.session.user ? next() : res.redirect("/login");

// Cek apakah user admin
const isAdmin = (req, res, next) =>
  req.session.user?.role === "admin"
    ? next()
    : res.redirect("/dashboard");

// ================= ROUTES =================

// ===== HOME =====
app.get("/", (_, res) => res.render("home"));

// ================= AUTH ROUTES =================

// ===== REGISTER =====
app.get("/register", (_, res) => res.render("register"));

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10); // Hash password

  await pool.query(
    "INSERT INTO users (name,email,password) VALUES ($1,$2,$3)",
    [name, email, hash],
  );

  res.redirect("/login");
});

// ===== LOGIN =====
app.get("/login", (_, res) => res.render("login"));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email],
  );

  if (!result.rows.length) return res.redirect("/login");

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect("/login");

  // Simpan user ke session
  req.session.user = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  res.redirect("/dashboard");
});

// ===== LOGOUT =====
app.get("/logout", (req, res) => {
  req.session.destroy(); // Hapus session
  res.redirect("/");
});

// ================= THEME ROUTE =================
app.get("/toggle-theme", (req, res) => {
  req.session.theme =
    req.session.theme === "dark" ? "light" : "dark";
  res.redirect("back");
});

// ================= DASHBOARD =================
app.get("/dashboard", isAuth, async (req, res) => {
  const { role, search } = req.query;

  let query = "SELECT * FROM projects WHERE 1=1";
  const values = [];

  // Filter search nama
  if (search) {
    values.push(`%${search}%`);
    query += ` AND LOWER(name) LIKE LOWER($${values.length})`;
  }

  // Filter berdasarkan role (ARRAY PostgreSQL)
  if (role) {
    values.push(role);
    query += ` AND roles @> ARRAY[$${values.length}]`;
  }

  const result = await pool.query(query, values);

  // 🔥 Ambil semua role unik dari array roles
  const roleResult = await pool.query(`
    SELECT DISTINCT unnest(roles) AS role
    FROM projects
    ORDER BY role ASC
  `);

  const heroRoles = roleResult.rows.map(r => r.role);

  res.render("dashboard", {
    projects: result.rows,
    heroRoles,
    selectedRole: role || null,
    search,
  });
});

// ================= API SEARCH (AJAX) =================
app.get("/api/projects", isAuth, async (req, res) => {
  const { role, search } = req.query;

  let query = "SELECT * FROM projects WHERE 1=1";
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    query += ` AND LOWER(name) LIKE LOWER($${values.length})`;
  }

  if (role) {
    values.push(role);
    query += ` AND roles @> ARRAY[$${values.length}]`;
  }

  const result = await pool.query(query, values);

  res.json(result.rows);
});

// ================= DETAIL PROJECT =================
app.get("/projects/:id", isAuth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE id=$1",
    [req.params.id],
  );

  if (!result.rows.length) return res.redirect("/dashboard");

  res.render("detail-project", {
    project: result.rows[0],
  });
});

// ================= CREATE PROJECT =================
app.get("/add-project", isAdmin, (_, res) =>
  res.render("add-project", { heroRoles }),
);

app.post(
  "/projects",
  isAdmin,
  upload.single("media"),
  async (req, res) => {
    let { name, description, gender, roles } = req.body;

    // Pastikan roles selalu array
    if (!roles) roles = [];
    if (!Array.isArray(roles)) roles = [roles];

    const media = req.file
      ? "/uploads/" + req.file.filename
      : null;

    await pool.query(
      `INSERT INTO projects (name,description,gender,roles,media)
       VALUES ($1,$2,$3,$4,$5)`,
      [name, description, gender, roles, media],
    );

    res.redirect("/dashboard");
  },
);

// ================= EDIT PROJECT =================
app.get("/projects/:id/edit", isAdmin, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM projects WHERE id=$1",
    [req.params.id],
  );

  if (!result.rows.length) return res.redirect("/dashboard");

  res.render("edit-project", {
    project: result.rows[0],
    heroRoles,
  });
});

app.put(
  "/projects/:id",
  isAdmin,
  upload.single("media"),
  async (req, res) => {
    let { name, description, gender, roles, oldMedia } =
      req.body;

    if (!roles) roles = [];
    if (!Array.isArray(roles)) roles = [roles];

    const media = req.file
      ? "/uploads/" + req.file.filename
      : oldMedia;

    await pool.query(
      `UPDATE projects
       SET name=$1, description=$2, gender=$3, roles=$4, media=$5
       WHERE id=$6`,
      [name, description, gender, roles, media, req.params.id],
    );

    res.redirect("/dashboard");
  },
);

// ================= DELETE PROJECT =================
app.delete("/projects/:id", isAdmin, async (req, res) => {
  await pool.query(
    "DELETE FROM projects WHERE id=$1",
    [req.params.id],
  );

  res.redirect("/dashboard");
});

// ================= START SERVER =================
app.listen(PORT, () =>
  console.log("Server running on port", PORT),
);
