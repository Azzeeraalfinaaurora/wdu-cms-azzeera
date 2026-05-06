import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// GET /api/v1/media - List all files
router.get('/', async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// POST /api/v1/media/upload - Handle file upload
router.post('/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, mimetype, size } = req.file;
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/uploads/${filename}`;

    const newMedia = await prisma.media.create({
      data: {
        filename: req.file.originalname,
        url: url,
        mimeType: mimetype,
        size: size,
        uploadedBy: req.user?.userId || 'Unknown'
      }
    });

    res.status(201).json(newMedia);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to save media metadata' });
  }
});

// DELETE /api/v1/media/:id - Delete file
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return res.status(404).json({ error: 'Media not found' });

    // 1. Delete actual file from disk
    const filename = media.url.split('/').pop();
    const filePath = path.join(process.cwd(), 'uploads', filename!);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 2. Delete from DB
    await prisma.media.delete({ where: { id } });

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;

