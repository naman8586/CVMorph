-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_base" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "personal_info" JSONB NOT NULL DEFAULT '{}',
    "education" JSONB NOT NULL DEFAULT '[]',
    "experience" JSONB NOT NULL DEFAULT '[]',
    "projects" JSONB NOT NULL DEFAULT '[]',
    "skills" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" SERIAL NOT NULL,
    "resume_base_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "job_description" TEXT,
    "adapted_content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "resume_base_user_id_key" ON "resume_base"("user_id");

-- CreateIndex
CREATE INDEX "resume_base_user_id_idx" ON "resume_base"("user_id");

-- CreateIndex
CREATE INDEX "resume_versions_user_id_idx" ON "resume_versions"("user_id");

-- CreateIndex
CREATE INDEX "resume_versions_resume_base_id_idx" ON "resume_versions"("resume_base_id");

-- CreateIndex
CREATE INDEX "resume_versions_role_idx" ON "resume_versions"("role");

-- AddForeignKey
ALTER TABLE "resume_base" ADD CONSTRAINT "resume_base_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resume_base_id_fkey" FOREIGN KEY ("resume_base_id") REFERENCES "resume_base"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
