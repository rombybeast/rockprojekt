import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/koncertek', async (req, res) => {
  try {
    const apiResponse = await fetch('https://retoolapi.dev/k5WJle/data');
    const koncertek = await apiResponse.json();
    res.json(koncertek);
  } catch (error) {
    res.status(500).json({ message: 'API hiba történt' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend fut: http://localhost:${PORT}`);
});
