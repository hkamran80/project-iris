"use client";

import { useParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { classNames } from "@hkamran/utility-web";
import { addItem, deleteItem } from "@/app/edit/[date]/actions";
import type { StoryGroup, StoryLink } from "@/types/stories";

type Props = {
    group: StoryGroup;
    index: number;
    length: number;
    firstIndex: number;
};

const StoryGroupRowIndexAdjustment = ({
    group,
    index,
    length,
    firstIndex,
}: Props) => {
    const params = useParams() as { date: string };
    const [_, startTransition] = useTransition();

    const moveUp = () => {
        startTransition(() => deleteItem(params.date, index, false));
        startTransition(() => addItem(params.date, group, index - 1));
    };

    const moveDown = () => {
        startTransition(() => deleteItem(params.date, index, false));
        startTransition(() => addItem(params.date, group, index + 1));
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
                    index === firstIndex - 1 || index === length - 1
                        ? "invisible"
                        : "",
                )}
                disabled={index === firstIndex - 1 || index === length - 1}
                onClick={() => moveDown()}
            >
                <ChevronDown size={24} />
            </button>
        </>
    );
};

export default StoryGroupRowIndexAdjustment;
