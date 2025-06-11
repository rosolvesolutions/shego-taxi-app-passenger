import express, { Request, Response } from 'express'
import multer from 'multer'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import path from 'path'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

const client = new ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../../keys/apiKey.json'),
})

// Extract MRZ-like lines (usually the last two lines with 40+ characters)
function extractMRZ(text: string): string[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length >= 40)
  return lines.slice(-2)
}

router.post('/ocr', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File

    if (!file) {
      console.warn('❗ No file received in request')
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    console.log('✅ Received file:', file.originalname)

    const [result] = await client.textDetection(file.buffer)

    const detections = result.textAnnotations ?? []
    const fullText = detections.length > 0 ? detections[0].description : ''
    const mrzLines = extractMRZ(fullText ?? '')


    console.log('✅ MRZ:', mrzLines)

    res.status(200).json({
      mrzLines,
      fullText,
    })
    } catch (err) {
    const error = err as Error
    console.error('❌ Error during OCR:', error.message)
    res.status(500).json({ error: 'Failed to process image', details: error.message })
  }
})

export default router