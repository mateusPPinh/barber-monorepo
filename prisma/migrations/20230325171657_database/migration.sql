-- CreateTable
CREATE TABLE "UserSchema" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "UserSchema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_email_key" ON "UserSchema"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSchema_password_key" ON "UserSchema"("password");