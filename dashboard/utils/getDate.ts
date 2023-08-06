import { cache } from "react";
import { client } from "@/lib/redis";
import type { StoriesDocument } from "@/types/stories";

export const revalidate = 30;

export const getDate = cache(async (date: string) => {
    if (!client.isOpen) await client.connect();
    const document = await client.json.get(date);
    return document as StoriesDocument;
});
