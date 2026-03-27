const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reset() {
  try {
    const user = await prisma.user.update({
      where: { email: 'mateusreys@gmail.com' },
      data: { password: '123456' }
    });
    console.log('Senha do usuário mateusreys@gmail.com atualizada para: 123456');
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

reset();
