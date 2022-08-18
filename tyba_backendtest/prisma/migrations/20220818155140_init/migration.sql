/*
  Warnings:

  - Added the required column `direccion` to the `transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitudBusqueda` to the `transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitudBusqueda` to the `transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `transaccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurante` to the `transaccion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaccion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "direccion" VARCHAR NOT NULL,
ADD COLUMN     "latitudBusqueda" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitudBusqueda" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "rating" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "restaurante" VARCHAR NOT NULL;
