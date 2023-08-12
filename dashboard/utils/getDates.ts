import { cache } from "react";
import { client } from "@/lib/redis";
import { getDateFromYYYYMMDD } from "@/lib/dates";

export const revalidate = 3600;

export const getDates = cache(async () => {
    if (!client.isOpen) await client.connect();
    const keys = await client.sendCommand(["keys", "????-??-??"]);
    return (keys as string[]).sort(
        (a, b) =>
            getDateFromYYYYMMDD(b).getTime() - getDateFromYYYYMMDD(a).getTime(),
    );
});
