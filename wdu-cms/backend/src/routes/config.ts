import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const configs = await prisma.siteConfig.findMany();
  res.json(configs);
});

router.put('/:key', authenticateToken, authorizeRole(['SUPER_ADMIN']), async (req, res) => {
  const { value } = req.body;
  const config = await prisma.siteConfig.upsert({
    where: { key: req.params.key },
    update: { value },
    create: { key: req.params.key, value },
  });
  res.json(config);
});

router.post('/bulk', authenticateToken, authorizeRole(['SUPER_ADMIN']), async (req, res) => {
  const configs = req.body; // Expecting { key1: value1, key2: value2 }
  
  const results = await prisma.$transaction(
    Object.entries(configs).map(([key, value]) => 
      prisma.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );
  
  res.json(results);
});

export default router;