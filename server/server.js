const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());

app.get("/entropy", async (req, res) => {
  try {
    const response = await fetch(
      "https://random.colorado.edu/api/chains/bafyriqci6f3st2mg7gq733ho4zvvth32zpy2mtiylixwmhoz6d627eo3jfpmbxepe54u2zdvymonq5sp3armtm4rodxsynsirr5g3xsbd3q4s/pulses/latest"
    );

    if (!response.ok) {
      throw new Error("CURBy API failed");
    }

    const json = await response.json();

    // ✅ Extract real entropy sources
    const payload = json?.data?.content?.payload;

    const pre = payload?.pre?.["/"]?.bytes;
    const salt = payload?.salt?.["/"]?.bytes;
    const timestamp = payload?.timestamp;

    if (!pre || !salt || !timestamp) {
      throw new Error("Missing entropy fields");
    }

    // ✅ Combine + hash (this is your REAL entropy)
    const combined = pre + salt + timestamp;

    const hash = crypto
      .createHash("sha256")
      .update(combined)
      .digest("hex");

    // ✅ Convert hash → usable numbers (0–15)
    const nums = [];
    for (let i = 0; i < hash.length; i += 2) {
      nums.push(parseInt(hash.slice(i, i + 2), 16) % 16);
    }

    res.json({
      entropy: nums,
      source: "CURBy",
      timestamp,
    });

  } catch (err) {
    console.error("CURBy error:", err.message);
    res.status(500).json({ error: "Failed to fetch quantum entropy" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});