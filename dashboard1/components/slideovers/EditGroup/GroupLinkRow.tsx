import NavLink from "@/components/navigation/NavLink";
import { getStoryLink, getStoryLinkDisplay } from "@/lib/editor";
import GroupLinkIndexAdjustment from "./GroupLinkIndexAdjustment";
import GroupLinkDelete from "./GroupLinkDelete";
import type { StoryLink } from "@/types/stories";

type Props = {
    link: StoryLink;
    index: number;
    groupIndex: number;
    length: number;
};

const GroupLinkRow = ({ link, index, groupIndex, length }: Props) => {
    const storyLink = getStoryLinkDisplay(link);

    return (
        <p className="flex w-full items-center text-xs leading-5 text-gray-500">
            <div className="flex-1">
                <NavLink href={getStoryLink(storyLink)}>{storyLink}</NavLink>
            </div>

            <div className="items-center space-x-3">
                <GroupLinkIndexAdjustment
                    link={link}
                    index={index}
                    groupIndex={groupIndex}
                    length={length}
                />
                <GroupLinkDelete
                    link={link}
                    index={index}
                    groupIndex={groupIndex}
                />
            </div>
        </p>
    );
};

export default GroupLinkRow;
