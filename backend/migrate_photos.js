const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  const email = 'mateusreys@gmail.com';
  
  console.log(`Buscando usuário por e-mail: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('ERRO: Usuário não encontrado.');
    return;
  }

  console.log(`Usuário encontrado: ${user.name} (ID: ${user.id})`);

  // Broad search to find anything that should belong to him
  // Let's migrate ALL existing photos in the DB to his user to restore his history
  const allPhotos = await prisma.photo.findMany({
    where: {
      NOT: { userId: user.id }
    }
  });

  console.log(`Encontradas ${allPhotos.length} fotos antigas para restaurar.`);

  for (const photo of allPhotos) {
    await prisma.photo.update({
      where: { id: photo.id },
      data: { userId: user.id }
    });
    console.log(`Foto ${photo.id} restaurada com sucesso!`);
  }

  console.log('MIGRAÇÃO CONCLUÍDA!');
  await prisma.$disconnect();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
