import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const services = await prisma.service.findMany({
    where: req.query.active === 'true' ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(services);
});

router.get('/:id', async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

router.post('/', authenticateToken, async (req, res) => {
  const { title, description, icon } = req.body;
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const service = await prisma.service.create({
    data: { title, description, icon, order: (maxOrder._max.order || 0) + 1 },
  });
  res.json(service);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, icon, isActive } = req.body;
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: { title, description, icon, isActive },
  });
  res.json(service);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.patch('/reorder', authenticateToken, async (req, res) => {
  const { orders } = req.body;
  await Promise.all(
    orders.map((item: { id: string; order: number }) =>
      prisma.service.update({ where: { id: item.id }, data: { order: item.order } })
    )
  );
  res.json({ success: true });
});

export default router;