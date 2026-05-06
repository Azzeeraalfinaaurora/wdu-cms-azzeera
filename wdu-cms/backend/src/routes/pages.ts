import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const pages = await prisma.page.findMany({ orderBy: { slug: 'asc' } });
  res.json(pages);
});

router.get('/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

router.put('/:slug', authenticateToken, async (req, res, next) => {
  try {
    const { title, metaTitle, metaDesc, sections, isPublished } = req.body;
    const page = await prisma.page.upsert({
      where: { slug: req.params.slug },
      update: { title, metaTitle, metaDesc, sections, isPublished },
      create: { slug: req.params.slug, title, metaTitle, metaDesc, sections, isPublished },
    });
    res.json(page);
  } catch (error) {
    console.error('Error upserting page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
});

router.patch('/:slug/publish', authenticateToken, async (req, res) => {
  const { isPublished } = req.body;
  const page = await prisma.page.update({
    where: { slug: req.params.slug },
    data: { isPublished },
  });
  res.json(page);
});

export default router;
