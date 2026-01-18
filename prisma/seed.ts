const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

async function main() {
    console.log("Start Seeding...");

    const tenant = await prisma.tenant.create({
        data: {
            name: "Test Company",
            status: "ACTIVE",
        },
    });
    console.log("Created tenant:", tenant);

    // Create a test admin user for the tenant
    const adminUser = await prisma.user.create({
        data: {
            tenantId: tenant.id,
            email: "admin@example.com",
            passwordHash: "hashedpassword",
            role: "ADMIN",
            isActive: true,
        },
    });
    console.log("Created user:", adminUser);

    const memberUser = await prisma.user.create({
        data: {
            tenantId: tenant.id,
            email: "member@example.com",
            passwordHash: "hashedpassword",
            role: "MEMBER",
            isActive: true,
        },
    });
    console.log("Created user:", memberUser);

    const job1 = await prisma.job.create({
        data: {
            tenantId: tenant.id,
            type: "EMAIL_SEND",
            status: "QUEUED",
            inputJson:{
                to: "user@example.com",
                subject: "Welcome!",
                body: "Hello and welcome to our service."
            },
            requestedBy: adminUser.id,
            correlationId: randomUUID(),
        },
    });

    const job2 = await prisma.job.create({
        data: {
            tenantId: tenant.id,
            type: "DATA_PROCESSING",
            status: "RUNNING",
            inputJson:{
                fileUrl: "http://example.com/file1.csv",
                processType: "import",
            },
            requestedBy: memberUser.id,
            correlationId: randomUUID(),
        },
    });
    console.log("Created job:", {job1, job2});

    await prisma.jobEvent.create({
        data: {
            tenantId: tenant.id,
            jobId: job1.id,
            eventType: "JOB_CREATED",
            message: "Job has been created and queued.",
        },
    });

    await prisma.jobEvent.create({
        data: {
            tenantId: tenant.id,
            jobId: job2.id,
            eventType: "JOB_STARTED",
            message: "Job processing has started.",
        },
    });
    console.log("Created job events.");

    console.log("Seeding finished.");
}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
