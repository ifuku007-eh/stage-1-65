const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// supaya CSS & JS bisa dipakai
app.use(express.static(path.join(__dirname, "public")));

// routing halaman
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/my-project", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "my-project.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

// jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
