import { revalidatePath } from "next/cache";
import { client } from "@/lib/redis";
import { getDates } from "@/utils/getDates";
import DateCard from "@/components/DateCard";
import AddDateButton from "./AddDateButton";

const Home = async () => {
    const dates = (await getDates()).reverse();

    const addDate = async () => {
        "use server";

        if (!client.isOpen) await client.connect();

        const date = new Date();
        const dateString = new Date(
            +date - date.getTimezoneOffset() * 60 * 1000,
        )
            .toISOString()
            .split("T")[0];
        client.json.set(dateString, "$", { published: "", stories: [] });

        revalidatePath("/");
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="flex-auto">
                    <h1 className="text-lg font-semibold leading-6 text-gray-700 dark:text-gray-300">
                        Dates
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Select a date or create a new one to modify those
                        stories
                    </p>
                </div>
                <div className="mt-4 space-x-4 sm:ml-16 sm:mt-0">
                    <AddDateButton addDate={addDate} />
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
                {dates.map((date) => (
                    <DateCard key={date} date={date} />
                ))}
            </div>
        </div>
    );
};

export default Home;
