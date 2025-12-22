-- CreateTable
CREATE TABLE "PolicyAuditorRequest" (
    "id" TEXT NOT NULL,
    "received" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "operatorTicketId" TEXT NOT NULL,
    "gameNameId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "insurancePoliceId" TEXT NOT NULL,
    "policyRequestedAt" TIMESTAMP(3) NOT NULL,
    "bets" JSONB NOT NULL,

    CONSTRAINT "PolicyAuditorRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PolicyAuditorRequest_operatorTicketId_key" ON "PolicyAuditorRequest"("operatorTicketId");
