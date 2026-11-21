- Добавляем модель EmailVerificationToken
  model EmailVerificationToken {
  id        Int      @id @default(autoincrement())
  tokenHash String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  userId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@map("email_verification_tokens")
  }
- npx prisma migrate dev --name add_email_verification