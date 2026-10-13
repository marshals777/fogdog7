import { M_lib_operations_readiness_readiness as readiness } from "../src/server.tsx";
import { M_lib_db_db as db } from "../src/server.tsx";
try {
    const report = await readiness();
    console.log(JSON.stringify(report, null, 2));
    if (!report.configurationReady ||
        (process.argv.includes("--strict") && report.checks.some((c) => !c.ok)))
        process.exitCode = 1;
}
catch {
    console.error("Preflight unavailable. Check server configuration and migrations.");
    process.exitCode = 1;
}
finally {
    await db.$disconnect();
}
