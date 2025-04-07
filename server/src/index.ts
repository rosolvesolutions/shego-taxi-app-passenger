<<<<<<< HEAD
<<<<<<< HEAD
// placeholder file for now
=======
import express from 'express'
import cors from 'cors'
=======
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

<<<<<<< HEAD
dotenv.config();
>>>>>>> 1a821bc (env for express server is set up)
=======
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
>>>>>>> 5bb81b3 (Changed it from 2 .env files to 1 for simplicity)

const app = express()
const PORT = process.env.EXPRESS_SERVER_PORT;

app.use(cors({ origin: 'http://localhost:19006' })) // only allow Expo Web

app.get('/api/value', (req, res) => {
  res.json({ value: 'Express Server Status: WORKING!' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
>>>>>>> 5b6e47c (Express server is added and working!)
