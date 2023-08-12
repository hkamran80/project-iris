"use client";

import { useTransition } from "react";
import { UploadCloudIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { publishItem } from "./actions";

const PublishButton = () => {
    const params = useParams() as { date: string };
    const [_, startTransition] = useTransition();

    return (
        <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors duration-150 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-hk-grey dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-hk-grey-hover"
            onClick={() => startTransition(() => publishItem(params.date))}
        >
            Publish
        </button>
    );
};

export default PublishButton;
