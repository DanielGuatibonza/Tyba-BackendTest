/*
  Warnings:

  - Added the required column `direccion` to the `transaccion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaccion" ADD COLUMN     "direccion" VARCHAR NOT NULL;
