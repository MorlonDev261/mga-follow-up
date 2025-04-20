import { db } from "@/lib/db"

// --- USERS ---

// Récupérer un utilisateur par ID avec ses achats et relations d'entreprises
export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      purchases: true, // Inclure les achats
      entreprises: true, // Inclure les relations avec les entreprises
      workers: true, // Inclure les relations où l'utilisateur est un worker
      owners: true, // Inclure les relations où l'utilisateur est un owner
    },
  })
}

// Récupérer un utilisateur par email avec ses achats et relations d'entreprises
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

// Créer un utilisateur
export async function createUser(data: Partial<Omit<Parameters<typeof db.user.create>[0]['data'], 'id'>>) {
  return db.user.create({ data })
}

// Mettre à jour un utilisateur
export async function updateUser(id: string, data: Partial<Parameters<typeof db.user.update>[0]['data']>) {
  return db.user.update({ where: { id }, data })
}

// Supprimer un utilisateur
export async function deleteUser(id: string) {
  return db.user.delete({ where: { id } })
}

// --- COMPANIES ---

// Récupérer les entreprises d'un utilisateur
export async function getCompaniesByUser(userId: string) {
  return db.company.findMany({
    where: {
      OR: [
        { idOwner: { has: userId } },
        { subOwner: { has: userId } },
        { members: { has: userId } },
      ],
    },
    include: {
      idOwner: true, // Inclure les propriétaires
      subOwner: true, // Inclure les sous-propriétaires
      members: true, // Inclure les membres
    },
  })
}

// Récupérer une entreprise par ID avec ses relations
export async function getCompanyById(id: string) {
  return db.company.findUnique({
    where: { id },
    include: {
      idOwner: true, // Inclure les propriétaires
      subOwner: true, // Inclure les sous-propriétaires
      members: true, // Inclure les membres
    },
  })
}

// Créer une entreprise
export async function createCompany(data: Partial<Omit<Parameters<typeof db.company.create>[0]['data'], 'id'>>) {
  return db.company.create({ data })
}

// Mettre à jour une entreprise
export async function updateCompany(id: string, data: Partial<Parameters<typeof db.company.update>[0]['data']>) {
  return db.company.update({ where: { id }, data })
}

// Supprimer une entreprise
export async function deleteCompany(id: string) {
  return db.company.delete({ where: { id } })
}

// --- CONVERSATION HISTORY ---

// Récupérer les historiques de conversation d'un utilisateur
export async function getConversationsByUser(userId: string) {
  return db.conversationHistory.findMany({
    where: { userId },
    include: {
      user: true, // Inclure l'utilisateur
    },
  })
}

// Créer une conversation
export async function createConversation(data: { userId: string; role: string; content: string }) {
  return db.conversationHistory.create({ data })
}

// Supprimer une conversation
export async function deleteConversation(id: number) {
  return db.conversationHistory.delete({ where: { id } })
}

// --- PURCHASE ---

// Récupérer les achats d'un utilisateur
export async function getPurchasesByUser(userId: string) {
  return db.purchase.findMany({
    where: { userId },
    include: {
      user: true, // Inclure l'utilisateur
    },
  })
}

// Créer un achat
export async function createPurchase(data: { userId: string; productName: string; amount: number }) {
  return db.purchase.create({ data })
}

// Mettre à jour un achat
export async function updatePurchase(id: string, data: Partial<Parameters<typeof db.purchase.update>[0]['data']>) {
  return db.purchase.update({ where: { id }, data })
}

// Supprimer un achat
export async function deletePurchase(id: string) {
  return db.purchase.delete({ where: { id } })
}

// --- WORK RELATION ---

// Récupérer les relations de travail d'un utilisateur en tant que worker
export async function getWorkerRelations(userId: string) {
  return db.workRelation.findMany({
    where: { workerId: userId },
    include: {
      entreprise: true, // Inclure l'entreprise
    },
  })
}

// Récupérer les relations de travail d'un utilisateur en tant qu'entreprise
export async function getEntrepriseRelations(userId: string) {
  return db.workRelation.findMany({
    where: { entrepriseId: userId },
    include: {
      worker: true, // Inclure le worker
    },
  })
}

// Créer une relation de travail
export async function createWorkRelation(data: { workerId: string; entrepriseId: string }) {
  return db.workRelation.create({ data })
}

// --- CUSTOMER RELATION ---

// Récupérer les relations clients pour un utilisateur
export async function getCustomerRelations(userId: string) {
  return db.customerRelation.findMany({
    where: { ownerId: userId },
    include: {
      customer: true, // Inclure le client
    },
  })
}

// Récupérer les relations de propriétaires d'un utilisateur
export async function getOwnerRelations(userId: string) {
  return db.customerRelation.findMany({
    where: { customerId: userId },
    include: {
      owner: true, // Inclure le propriétaire
    },
  })
}

// Créer une relation client-propriétaire
export async function createCustomerRelation(data: { ownerId: string; customerId: string }) {
  return db.customerRelation.create({ data })
}
