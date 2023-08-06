"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditGroup from "../slideovers/EditGroup";
import type { StoryGroup } from "@/types/stories";

type Props = { group: StoryGroup; index: number };

const StoryGroupRowEdit = ({ group, index }: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <button
                type="button"
                className="transition-colors duration-150 ease-in-out hover:text-indigo-500"
                onClick={() => setOpen(true)}
            >
                <Pencil size={18} />
            </button>

            <EditGroup
                open={open}
                setOpen={setOpen}
                group={group}
                index={index}
            />
        </>
    );
};
export default StoryGroupRowEdit;
