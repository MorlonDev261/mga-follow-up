import { z } from "zod"
import { Role } from "@prisma/client"

// --- USER ---
export const createUserSchema = z.object({
  email: z.string().email(),
  tel: z.string().optional(),
  password: z.string().min(6).optional(),
  name: z.string().max(2048).optional(),
  image: z.string().url().optional(),
  coverPicture: z.string().url().optional(),
  emailVerified: z.date().optional(),
  role: z.string().optional(),
})

export const updateUserSchema = createUserSchema.partial()
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

// --- COMPANY ---
export const createCompanySchema = z.object({
  name: z.string().min(1),
  nif: z.string().optional(),
  stat: z.string().optional(),
  desc: z.string().min(1),
  owner: z.string().min(1),
  contact: z.string().min(1),
  adress: z.string().min(1),
})

export const updateCompanySchema = createCompanySchema.partial()
export type CreateCompanyInput = z.infer<typeof createCompanySchema>
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>

// --- COMPANY USER ---
export const companyUserSchema = z.object({
  userId: z.string(),
  companyId: z.string(),
  role: z.nativeEnum(Role),
})

export type CompanyUserInput = z.infer<typeof companyUserSchema>

// --- PURCHASE ---
export const createPurchaseSchema = z.object({
  userId: z.string(),
  productName: z.string(),
  amount: z.number().nonnegative(),
})

export const updatePurchaseSchema = createPurchaseSchema.partial()
export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>

// --- WORK RELATION ---
export const workRelationSchema = z.object({
  workerId: z.string(),
  entrepriseId: z.string(),
})

export type WorkRelationInput = z.infer<typeof workRelationSchema>

// --- CUSTOMER RELATION ---
export const customerRelationSchema = z.object({
  ownerId: z.string(),
  customerId: z.string(),
})

export type CustomerRelationInput = z.infer<typeof customerRelationSchema>

// --- CONVERSATION HISTORY ---
export const conversationSchema = z.object({
  userId: z.string(),
  role: z.string(),
  content: z.string(),
})

export type ConversationInput = z.infer<typeof conversationSchema>
