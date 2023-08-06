import { createClient } from "redis";

export const client = createClient({ url: process.env.REDIS_URL });

// eslint-disable-next-line no-console
client.on("error", (err) => console.log("Redis Client Error", err));
