import { dateToString, getDateFromYYYYMMDD } from "./dates";
import type { StoriesDocument, StoryGroup, StoryLink } from "./types";

const getStoryLinkDisplay = (link: StoryLink) =>
    typeof link === "object" ? `<${link.link}> — "${link.title}"` : `<${link}>`;

const compileGroup = (group: StoryGroup): string =>
    [`*${group.name}*`, ...group.links.map(getStoryLinkDisplay)].join("\n");

const compileStory = (story: StoryGroup | StoryLink): string => {
    if (typeof story === "object" && "links" in story) {
        return compileGroup(story);
    }

    return getStoryLinkDisplay(story);
};

export const compileMessages = (
    date: string,
    storyDocument: StoriesDocument,
): string[] => {
    const header =
        `**${dateToString(date)}**` +
        (storyDocument.description ? ` (${storyDocument.description})` : "");

    const messageBlocks = [
        header,
        ...storyDocument.stories.map(compileStory).map((text) => `${text}\n`),
    ];

    let currentBlock = 0;
    const blocks: string[][] = [];
    const blocksLength: number[] = [];
    messageBlocks.forEach((message) => {
        if (blocks.at(currentBlock) === undefined) {
            blocks[currentBlock] = [];
        }
        if (blocksLength.at(currentBlock) === undefined) {
            blocksLength[currentBlock] = 0;
        }

        if (message.length + 1 + blocksLength[currentBlock] > 2000) {
            currentBlock++;
            blocks[currentBlock] = [message];
            blocksLength[currentBlock] = message.length;
        } else {
            blocks[currentBlock] = [...blocks[currentBlock], message];
            blocksLength[currentBlock] += message.length;
        }
    });

    blocks
        .filter((block) => block.length !== 0)
        .forEach((block, index) => {
            const lastMessageIndex = block.length - 1;
            blocks[index][lastMessageIndex] = block[lastMessageIndex].slice(
                0,
                -1,
            );
        });

    return blocks
        .filter((block) => block.length !== 0)
        .map((block) => block.join("\n"));
};

const updateTemplate = `<@&1105668001275060334> 
> **[datetime]**
> [updateType] stories for today have been posted in [thread] (if it says unknown, go to <#1075597808360501358>)! Feel free to discuss in the thread!
> If you have a story you think should be added, DM me!`;

export const generateUpdateMessage = (
    date: string,
    threadId: string,
    alreadyPublished: boolean,
): string => {
    const updateType = alreadyPublished ? "More" : "The first";

    const currentTime = new Date();
    const storyDate = getDateFromYYYYMMDD(date);
    const timestamp =
        new Date(
            storyDate.getFullYear(),
            storyDate.getMonth(),
            storyDate.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
        ).getTime() / 1000;
    const datetime = `<t:${timestamp}:f>`;

    return updateTemplate
        .replace("[datetime]", datetime)
        .replace("[updateType]", updateType)
        .replace("[thread]", `<#${threadId}>`);
};
