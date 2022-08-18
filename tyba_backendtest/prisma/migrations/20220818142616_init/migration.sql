/*
  Warnings:

  - You are about to drop the `Transaccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaccion" DROP CONSTRAINT "Transaccion_username_fkey";

-- DropTable
DROP TABLE "Transaccion";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "usuario" (
    "username" VARCHAR NOT NULL,
    "password" VARCHAR,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "transaccion" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "transaccion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaccion" ADD CONSTRAINT "transaccion_username_fkey" FOREIGN KEY ("username") REFERENCES "usuario"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
