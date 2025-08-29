const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Express middleware örneği
  server.use(express.json());

  // Özel API route
  server.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  // Next.js sayfalarını yakala (Express v5 uyumlu regex fallback)
  server.all(/.*/, (req, res) => {
    return handle(req, res).catch(err => {
      console.error("Next.js handle error:", err);
      res.status(500).send("Internal Server Error");
    });
  });

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
