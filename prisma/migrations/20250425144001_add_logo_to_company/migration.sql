-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'SUB_OWNER', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT,
    "password" TEXT,
    "name" VARCHAR(2048),
    "image" VARCHAR(2048),
    "coverPicture" VARCHAR(2048),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "refresh_token" TEXT,
    "scope" TEXT,
    "token_type" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationHistory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkRelation" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRelation" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistantContext" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistantContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nif" TEXT,
    "stat" TEXT,
    "desc" TEXT NOT NULL,
    "logo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockEntry" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "arrival" TIMESTAMP(3) NOT NULL,
    "stockDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockIdentifier" (
    "id" SERIAL NOT NULL,
    "entryId" TEXT NOT NULL,
    "identifier" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "StockIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tel_key" ON "User"("tel");

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerAccountId_key" ON "Account"("providerAccountId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "WorkRelation_workerId_idx" ON "WorkRelation"("workerId");

-- CreateIndex
CREATE INDEX "WorkRelation_entrepriseId_idx" ON "WorkRelation"("entrepriseId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkRelation_workerId_entrepriseId_key" ON "WorkRelation"("workerId", "entrepriseId");

-- CreateIndex
CREATE INDEX "CustomerRelation_customerId_idx" ON "CustomerRelation"("customerId");

-- CreateIndex
CREATE INDEX "CustomerRelation_ownerId_idx" ON "CustomerRelation"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRelation_customerId_ownerId_key" ON "CustomerRelation"("customerId", "ownerId");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- CreateIndex
CREATE INDEX "CompanyUser_userId_idx" ON "CompanyUser"("userId");

-- CreateIndex
CREATE INDEX "CompanyUser_companyId_idx" ON "CompanyUser"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyUser_userId_companyId_key" ON "CompanyUser"("userId", "companyId");

-- CreateIndex
CREATE INDEX "Product_companyId_idx" ON "Product"("companyId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRelation" ADD CONSTRAINT "WorkRelation_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRelation" ADD CONSTRAINT "WorkRelation_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRelation" ADD CONSTRAINT "CustomerRelation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRelation" ADD CONSTRAINT "CustomerRelation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyUser" ADD CONSTRAINT "CompanyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyUser" ADD CONSTRAINT "CompanyUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockEntry" ADD CONSTRAINT "StockEntry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockIdentifier" ADD CONSTRAINT "StockIdentifier_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "StockEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
