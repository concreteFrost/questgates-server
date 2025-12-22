/*
  Warnings:

  - You are about to drop the column `insurancePoliceId` on the `PolicyAuditorRequest` table. All the data in the column will be lost.
  - Added the required column `insurancePolicyId` to the `PolicyAuditorRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PolicyAuditorRequest" DROP COLUMN "insurancePoliceId",
ADD COLUMN     "insurancePolicyId" TEXT NOT NULL;
