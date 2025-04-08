-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "age" INTEGER,
    "caregivingRole" TEXT,
    "careRecipientAge" TEXT,
    "challenges" TEXT[],
    "communicationMethod" TEXT,
    "interests" TEXT[],
    "location" TEXT,
    "consultationZoomLink" TEXT,
    "consultationScheduledAt" TIMESTAMP(3),
    "calendlyRescheduleUrl" TEXT,
    "calendlyCancelUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
