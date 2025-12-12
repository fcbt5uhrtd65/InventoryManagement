import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/register', (req, res) => {
  console.log('Received POST /api/auth/register');
  console.log('Body:', req.body);
  
  res.json({
    success: true,
    message: 'Test OK',
    body: req.body
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Test server OK' });
});

app.listen(3001, () => {
  console.log('Simple test server running on port 3001');
});
