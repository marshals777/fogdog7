import { M_lib_db_db as db } from "../src/server.tsx";
import { M_lib_admin_crypto_hashPassword as hashPassword } from "../src/server.tsx";
async function main() {
    const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw Error("Invalid bootstrap email");
    const passwordHash = await hashPassword(password);
    await db.$transaction(async (tx) => {
        const user = await tx.user.upsert({
            where: { email },
            create: {
                email,
                passwordHash,
                role: "ADMIN",
                displayName: "Administrator",
            },
            update: { passwordHash, role: "ADMIN" },
        });
        await tx.adminSession.deleteMany({ where: { userId: user.id } });
    });
    console.log("Administrator created/updated. Existing sessions revoked. Remove bootstrap password from env.");
}
main()
    .catch(() => {
    console.error("Admin bootstrap failed; verify email, password length (16–128) and DB.");
    process.exitCode = 1;
})
    .finally(() => db.$disconnect());
