import prisma from '../src/lib/prisma'
import fs from 'fs'
import path from 'path'

async function main() {
  console.log('📸 Capturando snapshot do banco...\n')

  const [
    users,
    categories,
    addresses,
    products,
    productImages,
    carts,
    cartItems,
    orders,
    orderItems,
    payments,
    processedStripeEvents,
  ] = await Promise.all([
    prisma.user.findMany(),
    prisma.category.findMany(),
    prisma.address.findMany(),
    prisma.product.findMany(),
    prisma.productImage.findMany(),
    prisma.cart.findMany(),
    prisma.cartItem.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.payment.findMany(),
    prisma.processedStripeEvent.findMany(),
  ])

  const tables = {
    users,
    categories,
    addresses,
    products,
    productImages,
    carts,
    cartItems,
    orders,
    orderItems,
    payments,
    processedStripeEvents,
  }

  for (const [table, rows] of Object.entries(tables)) {
    console.log(`  ${table}: ${rows.length} registro(s)`)
  }

  const outputPath = path.join(__dirname, 'seed-data.json')
  fs.writeFileSync(outputPath, JSON.stringify(tables, null, 2), 'utf-8')

  console.log(`\n✅ Snapshot salvo em prisma/seed-data.json`)
}

main()
  .catch((err) => {
    console.error('❌ Erro ao gerar snapshot:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
