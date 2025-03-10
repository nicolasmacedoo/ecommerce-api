// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Criar permissões
  const permissions = [
    // Permissões de usuário
    { name: 'user:create', description: 'Criar usuários' },
    { name: 'user:read', description: 'Visualizar usuários' },
    { name: 'user:update', description: 'Atualizar usuários' },
    { name: 'user:delete', description: 'Deletar usuários' },
    
    // Permissões de cliente
    { name: 'customer:create', description: 'Criar clientes' },
    { name: 'customer:read', description: 'Visualizar clientes' },
    { name: 'customer:update', description: 'Atualizar clientes' },
    { name: 'customer:delete', description: 'Deletar clientes' },
    
    // Permissões de produto
    { name: 'product:create', description: 'Criar produtos' },
    { name: 'product:read', description: 'Visualizar produtos' },
    { name: 'product:update', description: 'Atualizar produtos' },
    { name: 'product:delete', description: 'Deletar produtos' },
    
    // Permissões de pedido
    { name: 'order:create', description: 'Criar pedidos' },
    { name: 'order:read', description: 'Visualizar pedidos' },
    { name: 'order:update', description: 'Atualizar pedidos' },
    { name: 'order:delete', description: 'Deletar pedidos' },
    
    // Permissões de relatório
    { name: 'report:read', description: 'Visualizar relatórios' },
  ];

  // Criar permissões no banco de dados
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: {
        name: permission.name,
        description: permission.description,
      },
    });
  }

  // Criar roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrador com acesso irrestrito',
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
      description: 'Cliente com acesso limitado',
    },
  });

  // Associar todas as permissões ao admin
  const allPermissions = await prisma.permission.findMany();
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: allPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Associar permissões específicas ao cliente
  const clientPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'user:read',
          'customer:read',
          'customer:update',
          'product:read',
          'order:create',
          'order:read',
        ],
      },
    },
  });

  await prisma.role.update({
    where: { id: customerRole.id },
    data: {
      permissions: {
        connect: clientPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Criar um usuário admin padrão
  const hashedPassword = await hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });