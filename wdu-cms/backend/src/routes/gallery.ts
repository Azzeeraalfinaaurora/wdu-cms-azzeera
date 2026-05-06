import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    const where: any = {};
    
    if (active === 'true') {
      where.isActive = true;
    }
    
    const galleries = await prisma.gallery.findMany({
      where,
      orderBy: { order: 'asc' }
    });
    
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, imageUrl, category, isActive } = req.body;
    
    const maxOrder = await prisma.gallery.aggregate({
      _max: { order: true }
    });
    
    const gallery = await prisma.gallery.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        isActive: isActive ?? true,
        order: (maxOrder._max.order || 0) + 1
      }
    });
    
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, imageUrl, category, isActive, order } = req.body;
    
    const gallery = await prisma.gallery.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        imageUrl,
        category,
        isActive,
        order
      }
    });
    
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.gallery.delete({
      where: { id: req.params.id }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

router.patch('/reorder', authenticateToken, async (req, res) => {
  try {
    const { orders } = req.body;
    
    await Promise.all(
      orders.map((item: { id: string; order: number }) =>
        prisma.gallery.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder gallery items' });
  }
});

export default router;
