"use server";

import { revalidatePath } from "next/cache";
import { client } from "@/lib/redis";
import { pathGenerator } from "@/lib/editor";
import type { StoryGroup, StoryLink } from "@/types/stories";

export const addItem = async (
    date: string,
    item: StoryLink | StoryGroup,
    index?: number,
    revalidate: boolean = true,
    groupIndex?: number,
) => {
    if (!client.isOpen) await client.connect();

    if (!index) {
        await client.json.arrAppend(date, pathGenerator(groupIndex), item);
    } else {
        await client.json.arrInsert(
            date,
            pathGenerator(groupIndex),
            index,
            item,
        );
    }

    if (revalidate) revalidatePath(`/edit/${date}`);
};

export const deleteItem = async (
    date: string,
    index: number,
    revalidate: boolean = true,
    groupIndex?: number,
) => {
    if (!client.isOpen) await client.connect();
    await client.json.del(date, `${pathGenerator(groupIndex)}[${index}]`);
    if (revalidate) revalidatePath(`/edit/${date}`);
};

export const publishItem = async (date: string) => {
    if (!client.isOpen) await client.connect();
    await client.json.set(date, "$.published", new Date().toISOString());
    await client.publish("updates", date);
    revalidatePath(`/edit/${date}`);
};

export const updateGroupName = async (
    date: string,
    groupIndex: number,
    newName: string,
) => {
    if (!client.isOpen) await client.connect();

    await client.json.set(
        date,
        `${pathGenerator(groupIndex, "name")}`,
        newName,
    );

    revalidatePath(`/edit/${date}`);
};
