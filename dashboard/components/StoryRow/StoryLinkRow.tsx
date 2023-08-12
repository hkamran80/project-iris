import { getStoryLink, getStoryLinkDisplay } from "@/lib/editor";
import NavLink from "../navigation/NavLink";
import StoryRowIndexAdjustment from "./StoryRowIndexAdjustment";
import StoryRowDelete from "./StoryRowDelete";
import type { StoryLink } from "@/types/stories";

type Props = {
    link: StoryLink;
    index: number;
    length: number;
    firstIndex: number;
};

const StoryLinkRow = ({ link, index, length, firstIndex }: Props) => {
    const storyLink = getStoryLinkDisplay(link);

    return (
        <p className="flex w-full items-center text-xs leading-5 text-gray-500">
            <div className="flex-1 truncate">
                <NavLink href={getStoryLink(link)}>{storyLink}</NavLink>
            </div>

            <div className="items-center space-x-3">
                <StoryRowIndexAdjustment
                    link={link}
                    index={index}
                    length={length}
                    firstIndex={firstIndex}
                />
                <StoryRowDelete link={link} index={index} />
            </div>
        </p>
    );
};

export default StoryLinkRow;
