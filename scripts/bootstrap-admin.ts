import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

export async function promoteToAdmin(prisma: PrismaClient, email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    throw new Error(
      `No user found with email "${email}". Sign in with that email at /login first, then re-run.`
    );
  }
  return prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
}

async function main() {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    throw new Error("ADMIN_EMAIL must be set in .env.local");
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set");
  }
  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });
  try {
    const user = await promoteToAdmin(prisma, email);
    console.log(`✔ Promoted ${user.email} to ADMIN.`);
  } finally {
    await prisma.$disconnect();
  }
}

// Run main() only when this file is the entry point
// ESM-safe check: works whether tsx runs as ESM or CJS
if (process.argv[1]?.endsWith("bootstrap-admin.ts")) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
