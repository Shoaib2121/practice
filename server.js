const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let lastItemData = null;

app.post('/api/shopify/update-item', (req, res) => {
  const item = req.body;
  console.log('Received from NetSuite:', item);

  lastItemData = item;

  res.status(200).json({
    status: 'success',
    message: 'Item received from NetSuite',
    data: item
  });
});

app.get('/api/shopify/last-item', (req, res) => {
  if (!lastItemData) {
    return res.status(404).json({ message: 'No item received yet.' });
  }
  res.status(200).json(lastItemData);
});

app.listen(PORT, () => {
  console.log(`🚀 Middleware running at http://localhost:${PORT}`);
});
