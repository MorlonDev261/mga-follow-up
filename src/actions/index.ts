"use server"

import db from "@/lib/db"
import { Prisma } from "@prisma/client"
import { Role } from "@prisma/client"
import moment from "moment"

import {
  createUserSchema, updateUserSchema, CreateUserInput, UpdateUserInput,
  createCompanySchema, updateCompanySchema, CreateCompanyInput, UpdateCompanyInput,
  companyUserSchema, CompanyUserInput,
  createPurchaseSchema, updatePurchaseSchema, CreatePurchaseInput, UpdatePurchaseInput,
  workRelationSchema, WorkRelationInput,
  customerRelationSchema, CustomerRelationInput,
  conversationSchema, ConversationInput
} from "./schema"

// --- USERS ---

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      purchases: true,
      entreprises: true,
      workers: true,
      owners: true,
    },
  })
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      purchases: true,
      entreprises: true,
      workers: true,
      owners: true,
    },
  })
}

export async function createUser(data: CreateUserInput) {
  const parsed = createUserSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid user data")
  return db.user.create({ data: parsed.data })
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const parsed = updateUserSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid user update data")
  return db.user.update({ where: { id }, data: parsed.data })
}

export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } })
}

// --- COMPANIES ---

export async function getCompaniesByUser(userId: string) {
  return db.companyUser.findMany({
    where: { userId },
    include: {
      company: true,
    },
  })
}

export async function getCompaniesByUserAndRole(userId: string, role: Role) {
  return db.companyUser.findMany({
    where: { userId, role },
    include: {
      company: true,
    },
  })
}

export async function getCompanyById(id: string) {
  return db.company.findUnique({
    where: { id },
    include: {
      users: {
        include: {
          user: true,
        },
      },
    },
  })
}

export async function createCompany(data: CreateCompanyInput) {
  const parsed = createCompanySchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid company data")
  return db.company.create({ data: parsed.data })
}

export async function updateCompany(id: string, data: UpdateCompanyInput) {
  const parsed = updateCompanySchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid company update data")
  return db.company.update({ where: { id }, data: parsed.data })
}

export async function deleteCompany(id: string) {
  return db.company.delete({ where: { id } })
}

// --- COMPANY USER ---

export async function createCompanyUser(data: CompanyUserInput) {
  const parsed = companyUserSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid company user data")
  return db.companyUser.create({ data: parsed.data })
}

// --- CONVERSATION HISTORY ---

export async function getConversationsByUser(userId: string) {
  return db.conversationHistory.findMany({
    where: { userId },
  })
}

export async function createConversation(data: ConversationInput) {
  const parsed = conversationSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid conversation data")
  return db.conversationHistory.create({ data: parsed.data })
}

export async function deleteConversation(id: number) {
  return db.conversationHistory.delete({ where: { id } })
}

// --- PURCHASE ---

export async function getPurchasesByUser(userId: string) {
  return db.purchase.findMany({
    where: { userId },
  })
}

export async function createPurchase(data: CreatePurchaseInput) {
  const parsed = createPurchaseSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid purchase data")
  return db.purchase.create({ data: parsed.data })
}

export async function updatePurchase(id: string, data: UpdatePurchaseInput) {
  const parsed = updatePurchaseSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid purchase update data")
  return db.purchase.update({ where: { id }, data: parsed.data })
}

export async function deletePurchase(id: string) {
  return db.purchase.delete({ where: { id } })
}

// --- WORK RELATION ---

export async function getWorkerRelations(userId: string) {
  return db.workRelation.findMany({
    where: { workerId: userId },
    include: {
      entreprise: true,
    },
  })
}

export async function getEntrepriseRelations(userId: string) {
  return db.workRelation.findMany({
    where: { entrepriseId: userId },
    include: {
      worker: true,
    },
  })
}

export async function createWorkRelation(data: WorkRelationInput) {
  const parsed = workRelationSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid work relation data")
  return db.workRelation.create({ data: parsed.data })
}

// --- CUSTOMER RELATION ---

export async function getCustomerRelations(userId: string) {
  return db.customerRelation.findMany({
    where: { ownerId: userId },
    include: {
      customer: true,
    },
  })
}

export async function getOwnerRelations(userId: string) {
  return db.customerRelation.findMany({
    where: { customerId: userId },
    include: {
      owner: true,
    },
  })
}

export async function createCustomerRelation(data: CustomerRelationInput) {
  const parsed = customerRelationSchema.safeParse(data)
  if (!parsed.success) throw new Error("Invalid customer relation data")
  return db.customerRelation.create({ data: parsed.data })
}

// === PRODUCTS ===

export async function createProduct(data: { name: string; companyId: string }) {
  const { name, companyId } = data

  if (!name.trim() || !companyId.trim()) {
    throw new Error('Nom du produit et companyId requis.')
  }

  try {
    const newProduct = await db.product.create({
      data: {
        name,
        companyId,
      },
    })
    return newProduct
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    throw new Error('Erreur serveur lors de la création du produit.')
  }
}

export async function getProductsByCompany(companyId: string, date?: string) {
  if (!companyId.trim()) {
    throw new Error("L'identifiant de l'entreprise est requis.")
  }

  try {
    const where: Prisma.ProductWhereInput = {
      companyId,
    }

    if (date) {
      const start = moment(date, 'YYYY-MM-DD').startOf('day').toDate()
      const end = moment(date, 'YYYY-MM-DD').endOf('day').toDate()

      where.createdAt = {
        gte: start,
        lte: end,
      }
    }

    const products = await db.product.findMany({
      where,
      include: {
        entries: {
          orderBy: { createdAt: 'desc' }, // ordonne les entrées aussi
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    throw new Error("Erreur serveur lors de la récupération des produits.")
  }
}

// === STOCK ENTRIES ===

export async function listStocksByCompany(companyId: string) {
  if (!companyId.trim()) {
    throw new Error("L'identifiant de l'entreprise est requis.")
  }

  try {
    const summary = await db.stockEntry.groupBy({
      by: ['stockDate'],
      where: {
        product: {
          companyId,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        stockDate: 'desc',
      },
    })

    return summary.map(item => ({
      stockDate: item.stockDate,
      nbrProduct: item._count.id,
    }))
  } catch (error) {
    console.error("Erreur lors du résumé des stocks par entreprise:", error)
    throw new Error("Erreur serveur lors du résumé des stocks.")
  }
}

export async function getStockEntriesByProduct(productId: string) {
  if (!productId.trim()) {
    throw new Error("L'identifiant du produit est requis.")
  }

  try {
    const entries = await db.stockEntry.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    return entries
  } catch (error) {
    console.error("Erreur lors de la récupération des stocks:", error)
    throw new Error("Erreur serveur lors de la récupération des stocks.")
  }
}
