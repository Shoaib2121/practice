const express = require("express");
const axios = require("axios"); // for making requests
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let lastItemData = null;

// Replace with your actual Suitelet URL
const NETSUITE_SUITELET_URL =
  "https://td3032620.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=92&deploy=1&compid=TD3032620&ns-at=AAEJ7tMQrn10xDgPNQbaSVdrZPPttonuFVrZ-x9Vk7bkgB24yKU";

app.post("/api/shopify/update-item", async (req, res) => {
  const item = req.body;
  console.log("✅ Received from NetSuite:", item);

  lastItemData = item;

  try {
    // Forward the data to NetSuite Suitelet
    const nsResponse = await axios.post(NETSUITE_SUITELET_URL, item, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0", // ✅ you said you want Mozilla/5.0
      },
    });

    console.log("📡 Sent to NetSuite Suitelet. Response:", nsResponse.data);

    res.status(200).json({
      status: "success",
      message: "Item received & forwarded to NetSuite Suitelet",
      suiteletResponse: nsResponse.data,
    });
  } catch (error) {
    console.error(
      "❌ Error sending to Suitelet:",
      error.response?.data || error.message
    );

    res.status(500).json({
      status: "error",
      message: "Failed to forward item to NetSuite Suitelet",
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/shopify/last-item", (req, res) => {
  if (!lastItemData) {
    return res.status(404).json({ message: "No item received yet." });
  }
  res.status(200).json(lastItemData);
});

app.listen(PORT, () => {
  console.log(`🚀 Middleware running at http://localhost:${PORT}`);
});
