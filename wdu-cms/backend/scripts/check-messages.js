const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.contactMessage.count();
  const messages = await prisma.contactMessage.findMany({ take: 5 });
  console.log('Total messages:', count);
  console.log('Recent messages:', JSON.stringify(messages, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
