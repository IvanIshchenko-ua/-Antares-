import express from "express";
import fetch from "node-fetch"; // Node <18
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // де лежить index.html

// універсальний проксі
app.get("/api/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const r = await fetch(`${process.env.STRAPI_URL}/api/${collection}?populate=*`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Помилка отримання даних" });
  }
});

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
