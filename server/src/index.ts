<<<<<<< HEAD
// placeholder file for now
=======
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3002

app.use(cors({ origin: 'http://localhost:19006' })) // only allow Expo Web

app.get('/api/value', (req, res) => {
  res.json({ value: 'Express Server Status: WORKING!' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
>>>>>>> 5b6e47c (Express server is added and working!)
