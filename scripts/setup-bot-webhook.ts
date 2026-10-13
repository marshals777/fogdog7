import { M_lib_commerce_core_siteOrigin as siteOrigin } from "../src/server.tsx";
const token = process.env.BOT_TOKEN, secret = process.env.BOT_WEBHOOK_SECRET;
async function main() {
    if (!token ||
        !secret ||
        secret.length < 32 ||
        !/^[A-Za-z0-9_-]+$/.test(secret))
        throw Error("bot_webhook_configuration_required");
    if (process.env.BOT_UPDATE_OWNER === "standalone")
        throw Error("standalone_bot_owns_webhook_use_bot_setup");
    const origin = siteOrigin();
    if (!origin.startsWith("https://"))
        throw Error("public_https_required");
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            url: `${origin}/api/bot/webhook`,
            secret_token: secret,
            allowed_updates: ["message", "callback_query", "pre_checkout_query"],
        }),
        signal: AbortSignal.timeout(15000),
    });
    const body = await response.json();
    if (!response.ok || !body.ok)
        throw Error("webhook_registration_failed");
    console.log("Telegram webhook configured.");
}
main().catch(() => {
    console.error("Webhook setup failed. Check HTTPS, BOT_TOKEN and BOT_WEBHOOK_SECRET.");
    process.exitCode = 1;
});
