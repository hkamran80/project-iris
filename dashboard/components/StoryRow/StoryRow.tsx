import StoryGroupRow from "./StoryGroupRow";
import StoryLinkRow from "./StoryLinkRow";
import type { StoryLink, Story, StoryGroup } from "@/types/stories";

type Props = {
    story: Story;
    index: number;
    length: number;
    firstIndex: number;
};

const StoryRow = ({ story, index, length, firstIndex }: Props) => {
    const isGroup = typeof story === "object" && "links" in story;

    return (
        <li className="flex justify-between gap-x-6 py-3">
            <div className="flex w-full min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                    {isGroup ? (
                        <StoryGroupRow
                            group={story as StoryGroup}
                            index={index}
                            length={length}
                            firstIndex={firstIndex}
                        />
                    ) : (
                        <StoryLinkRow
                            link={story as StoryLink}
                            index={index}
                            length={length}
                            firstIndex={firstIndex}
                        />
                    )}
                </div>
            </div>
        </li>
    );
};

export default StoryRow;
