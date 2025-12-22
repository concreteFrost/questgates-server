/*
  Warnings:

  - The primary key for the `PolicyAuditorRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PolicyAuditorRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PolicyAuditorRequest" DROP CONSTRAINT "PolicyAuditorRequest_pkey",
DROP COLUMN "id";
