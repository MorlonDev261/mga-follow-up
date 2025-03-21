-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "contact" TEXT NOT NULL,
    "name" TEXT,
    "pdp" TEXT,
    "pdc" TEXT,
    "purchase" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkRelation" (
    "id" SERIAL NOT NULL,
    "workerId" INTEGER NOT NULL,
    "entrepriseId" INTEGER NOT NULL,

    CONSTRAINT "WorkRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerRelation" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "CustomerRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_key" ON "User"("contact");

-- AddForeignKey
ALTER TABLE "WorkRelation" ADD CONSTRAINT "WorkRelation_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkRelation" ADD CONSTRAINT "WorkRelation_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRelation" ADD CONSTRAINT "CustomerRelation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerRelation" ADD CONSTRAINT "CustomerRelation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
