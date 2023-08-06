import type { StoryLink, Story, StoryGroup } from "@/types/stories";

export const generateKey = (story: Story): string => {
    if (typeof story === "object" && "links" in story) {
        return (story as StoryGroup).name;
    }

    if (typeof story == "object" && "link" in story) {
        return (story as StoryLink).link as string;
    }

    return story;
};

export const getStoryLinkDisplay = (link: StoryLink) =>
    typeof link === "object" ? `${link.title} (${link.link})` : link;

export const getStoryLink = (link: StoryLink) =>
    typeof link === "object" ? link.link : link;

export const pathGenerator = (
    groupIndex?: number,
    endpoint: "links" | "name" = "links",
) => {
    if (groupIndex !== undefined) {
        return `$.stories[${groupIndex}].${endpoint}`;
    }

    return "$.stories";
};
