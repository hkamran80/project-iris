"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import DeleteItem from "../modals/DeleteItem";
import type { StoryLink } from "@/types/stories";

type Props = { link: StoryLink; index: number };

const StoryRowDelete = ({ link, index }: Props) => {
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    return (
        <>
            <button
                type="button"
                className="transition-colors duration-150 ease-in-out hover:text-red-500"
                onClick={() => setOpenDelete(true)}
            >
                <Trash2 size={20} />
            </button>

            <DeleteItem
                open={openDelete}
                setOpen={setOpenDelete}
                item={link}
                index={index}
            />
        </>
    );
};
export default StoryRowDelete;
