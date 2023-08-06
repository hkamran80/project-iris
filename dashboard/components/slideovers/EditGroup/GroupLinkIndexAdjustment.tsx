/* eslint-disable no-console */
"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { classNames } from "@hkamran/utility-web";
import { addItem, deleteItem } from "@/app/edit/[date]/actions";
import type { StoryLink } from "@/types/stories";

type Props = {
    link: StoryLink;
    index: number;
    groupIndex: number;
    length: number;
};

const GroupLinkIndexAdjustment = ({
    link,
    index,
    groupIndex,
    length,
}: Props) => {
    const params = useParams() as { date: string };
    const [_, startTransition] = useTransition();

    const moveUp = () => {
        console.log(`Moving ${link} up from ${index} to ${index - 1}`);

        startTransition(() =>
            deleteItem(params.date, index, false, groupIndex),
        );
        startTransition(() =>
            addItem(params.date, link, index - 1, true, groupIndex),
        );
    };

    const moveDown = () => {
        console.log(`Moving ${link} down from ${index} to ${index + 1}`);

        startTransition(() =>
            deleteItem(params.date, index, false, groupIndex),
        );
        startTransition(() =>
            addItem(params.date, link, index + 1, true, groupIndex),
        );
    };

    return (
        <>
            <button
                type="button"
                className={classNames(
                    "transition duration-150 ease-in-out hover:scale-125 hover:text-indigo-500",
                    index === 0 ? "invisible" : "",
                )}
                disabled={index === 0}
                onClick={() => moveUp()}
            >
                <ChevronUp size={24} />
            </button>
            <button
                type="button"
                className={classNames(
                    "transition duration-150 ease-in-out hover:scale-125 hover:text-indigo-500",
                    index === length - 1 ? "invisible" : "",
                )}
                disabled={index === length - 1}
                onClick={() => moveDown()}
            >
                <ChevronDown size={24} />
            </button>
        </>
    );
};

export default GroupLinkIndexAdjustment;
