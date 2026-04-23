import { PrismaClient, ReportCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.reportRequest.count();
  console.log(`PrimeBlueprint is ready. Existing report requests: ${count}`);

  const demoEmail = "demo@primeblueprint.ai";
  await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      fullName: "Demo Client",
      country: "United Kingdom",
      reportRequests: {
        create: {
          category: ReportCategory.BUSINESS_CAREER,
          userName: "Demo Client",
          email: demoEmail,
          mainGoal: "Get clearer positioning and more inbound leads",
          previewTitle: "Career Growth Strategy for Demo Client"
        }
      }
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
