import { db } from "@/lib/db"

// ==========================
// USER
// ==========================

export async function getUserById(id: string) {
  try {
    return await db.user.findUnique({
      where: { id },
      include: {
        purchases: true,
        entreprises: true,
        workers: true,
        owners: true,
      },
    })
  } catch (error) {
    console.error("Error in getUserById:", error)
    throw error
  }
}

// ==========================
// COMPANY
// ==========================

export async function getCompaniesByUser(userId: string) {
  return db.company.findMany({
    where: {
      OR: [
        { owner: { some: { userId } } },
        { workers: { some: { userId } } },
        { purchases: { some: { userId } } },
      ],
    },
    include: {
      owner: true,
      workers: true,
      purchases: true,
    },
  })
}

export async function getCompaniesByUserAndRole(userId: string, role: string) {
  if (role === "OWNER") {
    return db.company.findMany({
      where: {
        owner: {
          some: {
            userId,
          },
        },
      },
    })
  }

  if (role === "WORKER") {
    return db.company.findMany({
      where: {
        workers: {
          some: {
            userId,
          },
        },
      },
    })
  }

  if (role === "BUYER") {
    return db.company.findMany({
      where: {
        purchases: {
          some: {
            userId,
          },
        },
      },
    })
  }

  return []
}

// ==========================
// PRODUCT
// ==========================

export async function getProductById(id: string) {
  return db.product.findUnique({
    where: { id },
  })
}

export async function getProductsByCompany(companyId: string) {
  return db.product.findMany({
    where: { companyId },
  })
}

export async function createProduct(data: {
  name: string
  companyId: string
}) {
  return db.product.create({
    data,
  })
}

export async function updateProduct(id: string, data: Partial<{ name: string }>) {
  return db.product.update({
    where: { id },
    data,
  })
}

export async function deleteProduct(id: string) {
  return db.product.delete({
    where: { id },
  })
}

// ==========================
// STOCK ENTRY
// ==========================

export async function getStockEntriesByProduct(productId: string) {
  return db.stockEntry.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getStockEntriesByCompany(companyId: string) {
  return db.stockEntry.findMany({
    where: { product: { companyId } },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  })
}

export async function createStockEntry(data: {
  productId: string
  arrivalDate: Date
  stockDate: Date
  quantity: number
  identifiers: string[]
  comments: string[]
}) {
  return db.stockEntry.create({ data })
}

export async function updateStockEntry(id: string, data: Partial<{
  arrivalDate: Date
  stockDate: Date
  quantity: number
  identifiers: string[]
  comments: string[]
}>) {
  return db.stockEntry.update({
    where: { id },
    data,
  })
}

export async function deleteStockEntry(id: string) {
  return db.stockEntry.delete({
    where: { id },
  })
}
