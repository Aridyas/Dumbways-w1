-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProject" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "desc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "techs" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "techs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectTechs" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "techId" INTEGER NOT NULL,

    CONSTRAINT "projectTechs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "techs_value_key" ON "techs"("value");

-- CreateIndex
CREATE UNIQUE INDEX "projectTechs_projectId_techId_key" ON "projectTechs"("projectId", "techId");

-- AddForeignKey
ALTER TABLE "userProject" ADD CONSTRAINT "userProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectTechs" ADD CONSTRAINT "projectTechs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "userProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectTechs" ADD CONSTRAINT "projectTechs_techId_fkey" FOREIGN KEY ("techId") REFERENCES "techs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
