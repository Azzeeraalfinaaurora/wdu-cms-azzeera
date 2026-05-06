import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const contact = await prisma.contactMessage.create({
    data: { name, email, phone, subject, message },
  });
  res.json(contact);
});

router.get('/messages', authenticateToken, async (req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(messages);
});

router.patch('/messages/read-all', authenticateToken, async (req, res) => {
  await prisma.contactMessage.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  res.json({ success: true });
});

router.patch('/messages/:id/read', authenticateToken, async (req, res) => {
  const message = await prisma.contactMessage.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });
  res.json(message);
});

router.delete('/messages/:id', authenticateToken, authorizeRole(['SUPER_ADMIN']), async (req, res) => {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;