import { db } from "@/lib/db"

// --- USERS ---
export async function getUserById(id: string) {
  return db.user.findUnique({ where: { id } })
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } })
}

export async function createUser(data: Partial<Omit<Parameters<typeof db.user.create>[0]['data'], 'id'>>) {
  return db.user.create({ data: data as any })
}

export async function updateUser(id: string, data: Partial<Parameters<typeof db.user.update>[0]['data']>) {
  return db.user.update({ where: { id }, data })
}

export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } })
}

// --- COMPANIES ---
export async function getCompaniesByUser(userId: string) {
  return db.company.findMany({
    where: {
      OR: [
        { idOwner: { has: userId } },
        { subOwner: { has: userId } },
        { members: { has: userId } },
      ],
    },
  })
}

export async function getCompanyById(id: string) {
  return db.company.findUnique({ where: { id } })
}

export async function createCompany(data: Partial<Omit<Parameters<typeof db.company.create>[0]['data'], 'id'>>) {
  return db.company.create({ data: data as any })
}

export async function updateCompany(id: string, data: Partial<Parameters<typeof db.company.update>[0]['data']>) {
  return db.company.update({ where: { id }, data })
}

export async function deleteCompany(id: string) {
  return db.company.delete({ where: { id } })
}

// --- CONVERSATION HISTORY ---
export async function getConversationsByUser(userId: string) {
  return db.conversationHistory.findMany({ where: { userId } })
}

export async function createConversation(data: { userId: string; role: string; content: string }) {
  return db.conversationHistory.create({ data })
}

export async function deleteConversation(id: number) {
  return db.conversationHistory.delete({ where: { id } })
}

// --- PURCHASE ---
export async function getPurchasesByUser(userId: string) {
  return db.purchase.findMany({ where: { userId } })
}

export async function createPurchase(data: { userId: string; productName: string; amount: number }) {
  return db.purchase.create({ data })
}

export async function updatePurchase(id: string, data: Partial<Parameters<typeof db.purchase.update>[0]['data']>) {
  return db.purchase.update({ where: { id }, data })
}

export async function deletePurchase(id: string) {
  return db.purchase.delete({ where: { id } })
}

// --- WORK RELATION ---
export async function getWorkerRelations(userId: string) {
  return db.workRelation.findMany({ where: { workerId: userId } })
}

export async function getEntrepriseRelations(userId: string) {
  return db.workRelation.findMany({ where: { entrepriseId: userId } })
}

export async function createWorkRelation(data: { workerId: string; entrepriseId: string }) {
  return db.workRelation.create({ data })
}

// --- CUSTOMER RELATION ---
export async function getCustomerRelations(userId: string) {
  return db.customerRelation.findMany({ where: { ownerId: userId } })
}

export async function getOwnerRelations(userId: string) {
  return db.customerRelation.findMany({ where: { customerId: userId } })
}

export async function createCustomerRelation(data: { ownerId: string; customerId: string }) {
  return db.customerRelation.create({ data })
}
