import { useMemo } from "react";
import { dateToString } from "@/lib/dates";
import NavLink from "./navigation/NavLink";

type Props = {
    date: string;
};

const DateCard = ({ date }: Props) => {
    const dateString = useMemo(() => dateToString(date), [date]);

    return (
        <NavLink
            href={`/edit/${date}`}
            className="overflow-hidden rounded-lg bg-white shadow transition-colors duration-150 ease-in-out hover:cursor-pointer hover:bg-gray-200 dark:bg-hk-grey dark:hover:bg-hk-grey-hover"
        >
            <dd className="p-6 font-semibold text-gray-900 dark:text-gray-100">
                {dateString}
            </dd>
        </NavLink>
    );
};

export default DateCard;
