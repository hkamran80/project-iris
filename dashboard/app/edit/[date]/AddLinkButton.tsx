"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import AddLink from "@/components/modals/AddLink";
import { addItem } from "./actions";

const AddLinkButton = () => {
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const params = useParams() as { date: string };
    const [_, startTransition] = useTransition();

    return (
        <>
            <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => setOpenAdd(true)}
            >
                New Link
            </button>

            <AddLink
                open={openAdd}
                setOpen={setOpenAdd}
                add={(link) =>
                    startTransition(() => addItem(params.date, link))
                }
            />
        </>
    );
};

export default AddLinkButton;
