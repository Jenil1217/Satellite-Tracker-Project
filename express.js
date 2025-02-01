const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/visible", (req, res) => res.sendFile(path.join(__dirname, "public", "visible.html")));
app.get("/info", (req, res) => res.sendFile(path.join(__dirname, "public", "info.html")));

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
