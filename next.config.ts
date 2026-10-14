import {readFileSync} from "node:fs";
import type { NextConfig as NextConfig } from "next";
const config: NextConfig = {
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    async rewrites() {
        const paths=Object.keys(JSON.parse(readFileSync("assets.pack.json","utf8")));
        return paths.map(path => ({ source: "/" + path, destination: "/api/static/" + path }));
    },
    async redirects() {
        return [
            { source: "/", destination: "/uk", permanent: false },
            {
                source: "/:locale(uk|ru|en)/catalog/:category(telegram-accounts|steam-accounts|verifications|smm)",
                destination: "/:locale/:category",
                permanent: false,
            },
            {
                source: "/catalog/:category(telegram-accounts|steam-accounts|verifications|smm)",
                destination: "/uk/:category",
                permanent: false,
            },
            { source: "/nft-gifts", destination: "/uk/nft-gifts", permanent: false },
            {
                source: "/modules/:module(tour|about|rules|payment|privacy)",
                destination: "/uk/modules/:module",
                permanent: false,
            },
        ];
    },
};
export default config;
