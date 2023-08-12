import { dateToString } from "@/lib/dates";
import { generateKey } from "@/lib/editor";
import { getDate } from "@/utils/getDate";
import StoryRow from "@/components/StoryRow/StoryRow";
import PublishButton from "./PublishButton";
import AddGroupButton from "./AddGroupButton";
import AddLinkButton from "./AddLinkButton";

const Editor = async ({ params }: { params: { date: string } }) => {
    const dateString = dateToString(params.date);
    const document = await getDate(params.date);
    const firstNonGroupIndex = document.stories.findIndex(
        (story) =>
            typeof story !== "object" ||
            (typeof story === "object" && "link" in story),
    );

    return (
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="flex-auto">
                    <h1 className="text-lg font-semibold leading-6 text-gray-700 dark:text-gray-300">
                        {dateString}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {document.published === ""
                            ? "Unpublished"
                            : `Last published at ${new Date(document.published)
                                  .toLocaleString(undefined, {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      second: "numeric",
                                  })
                                  .replace(" at ", " ")}`}
                    </p>
                </div>
                <div className="mt-4 space-x-4 sm:ml-16 sm:mt-0 items-center">
                    <PublishButton />
                    <AddGroupButton firstNonGroupIndex={firstNonGroupIndex} />
                    <AddLinkButton />
                </div>
            </div>

            <div className="mt-8">
                {document.stories.length !== 0 ? (
                    <ul
                        role="list"
                        className="divide-y divide-gray-200 dark:divide-gray-800"
                    >
                        {document.stories.map((story, index) => (
                            <StoryRow
                                key={generateKey(story)}
                                story={story}
                                index={index}
                                length={document.stories.length}
                                firstIndex={firstNonGroupIndex}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="mx-auto w-full max-w-lg space-y-4 rounded-lg border-2 border-dotted border-gray-700 px-4 py-4 text-center dark:border-gray-300">
                        <p>No groups or links have been added yet.</p>

                        <div className="space-x-4">
                            <AddGroupButton
                                firstNonGroupIndex={firstNonGroupIndex}
                            />
                            <AddLinkButton />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Editor;
