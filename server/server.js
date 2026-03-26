const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/entropy", async (req, res) => {
  try {
    const response = await fetch(
      "https://random.colorado.edu/api/curbyq/round/latest/result"
    );

    if (!response.ok) {
      throw new Error("CURBy API failed");
    }

    const data = await response.json();

    let entropyString = "";

    // 1. top-level CID
    if (data.cid?.["/"]) {
      entropyString += data.cid["/"];
    }

    // 2. chain CID
    if (data.data?.content?.chain?.["/"]) {
      entropyString += data.data.content.chain["/"];
    }

    // 3. links (very important)
    if (data.data?.content?.links) {
      for (const link of data.data.content.links) {
        if (link["/"]) {
          entropyString += link["/"];
        }
      }
    }

    // 4. mixins (optional, if present)
    if (data.data?.mixins) {
      for (const m of data.data.mixins) {
        if (m.value?.["/"]) {
          entropyString += m.value["/"];
        }
      }
    }

    if (!entropyString) {
      throw new Error("No entropy extracted from CURBy");
    }

    // convert to numeric entropy
    const nums = [];

    for (let i = 0; i < entropyString.length; i++) {
      nums.push(entropyString.charCodeAt(i) % 16);
    }
    

    res.json({ data: nums });

  } catch (err) {
    console.error("CURBy error:", err.message);
    res.status(500).json({ error: "Failed to fetch entropy" });
  }
});
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});