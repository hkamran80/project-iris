import { getStoryLink, getStoryLinkDisplay } from "@/lib/editor";
import NavLink from "../navigation/NavLink";
import StoryGroupRowIndexAdjustment from "./StoryGroupRowIndexAdjustment";
import StoryGroupRowEdit from "./StoryGroupRowEdit";
import type { StoryGroup } from "@/types/stories";

type Props = {
    group: StoryGroup;
    index: number;
    length: number;
    firstIndex: number;
};

const StoryGroupRow = ({ group, index, length, firstIndex }: Props) => (
    <>
        <div className="flex items-center text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            <span className="flex-1">{group.name}</span>

            <div className="items-center space-x-3 text-gray-500">
                <StoryGroupRowIndexAdjustment
                    group={group}
                    index={index}
                    length={length}
                    firstIndex={firstIndex}
                />
                <StoryGroupRowEdit group={group} index={index} />
            </div>
        </div>

        <div className="mt-1 truncate text-xs leading-5 text-gray-500">
            {group.links.map((link) => {
                const storyLink = getStoryLinkDisplay(link);
                return (
                    <p key={storyLink}>
                        <NavLink href={getStoryLink(link)}>{storyLink}</NavLink>
                    </p>
                );
            })}
        </div>
    </>
);

export default StoryGroupRow;
