
let origin: URL;
try {
    origin = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
}
catch {
    throw Error("Set a valid HTTPS site origin before starting worker.");
}
const secret = process.env.INTERNAL_API_SECRET ?? "";
if (origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    secret.length < 32)
    throw Error("Set HTTPS site origin and INTERNAL_API_SECRET before starting worker.");
let stopped = false;
const stop = () => {
    stopped = true;
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
while (!stopped) {
    try {
        const response = await fetch(new URL("/api/internal/commerce/tick", origin.origin), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${secret}`,
                "Content-Type": "application/json",
            },
            body: "{}",
            redirect: "error",
            signal: AbortSignal.timeout(110000),
        });
        await response.body?.cancel();
        console.log(JSON.stringify({
            time: new Date().toISOString(),
            ok: response.ok,
            status: response.status,
        }));
    }
    catch {
        console.error(JSON.stringify({
            time: new Date().toISOString(),
            ok: false,
            code: "worker_transport",
        }));
    }
    if (!stopped)
        await new Promise<void>((resolve) => {
            const timer = setTimeout(done, 15000);
            function done() {
                clearTimeout(timer);
                process.off("SIGTERM", done);
                process.off("SIGINT", done);
                resolve();
            }
            process.once("SIGTERM", done);
            process.once("SIGINT", done);
        });
}
export {};
