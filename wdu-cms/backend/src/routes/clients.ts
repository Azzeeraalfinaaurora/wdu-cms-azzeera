import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET all clients (public: only active, admin: all)
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.headers.authorization;
    const where: any = isAdmin ? {} : { isActive: true };
    const clients = await prisma.client.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// POST create client (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, logoUrl } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ error: 'Name and logoUrl are required' });
    }
    const maxOrder = await prisma.client.aggregate({ _max: { order: true } });
    const client = await prisma.client.create({
      data: {
        name,
        logoUrl,
        order: (maxOrder._max.order || 0) + 1,
      },
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT update client (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, logoUrl, isActive } = req.body;
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { name, logoUrl, isActive },
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// PATCH reorder clients (admin only)
router.patch('/reorder', authenticateToken, async (req, res) => {
  try {
    const { orders } = req.body;
    await Promise.all(
      orders.map((item: { id: string; order: number }) =>
        prisma.client.update({ where: { id: item.id }, data: { order: item.order } })
      )
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder clients' });
  }
});

export default router;
