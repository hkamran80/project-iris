"use client";

import { useMemo, useState } from "react";
import AddGroup from "@/components/modals/AddGroup";

type Props = { firstNonGroupIndex: number };

const AddGroupButton = ({
    firstNonGroupIndex: originalFirstNonGroupIndex,
}: Props) => {
    const [openAdd, setOpenAdd] = useState<boolean>(false);

    const firstNonGroupIndex = useMemo(() => {
        // firstNonGroupIndex === -1 ? 0 :
        if (originalFirstNonGroupIndex === -1) {
            return 0;
        } else if (originalFirstNonGroupIndex === 0) {
            return 1;
        } else {
            return originalFirstNonGroupIndex;
        }
    }, [originalFirstNonGroupIndex]);

    return (
        <>
            <button
                type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-hk-grey dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-hk-grey-hover"
                onClick={() => setOpenAdd(true)}
            >
                New Group
            </button>

            <AddGroup
                open={openAdd}
                setOpen={setOpenAdd}
                firstNonGroupIndex={firstNonGroupIndex}
            />
        </>
    );
};

export default AddGroupButton;
