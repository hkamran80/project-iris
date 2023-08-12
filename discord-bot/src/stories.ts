export type StoryLink = string | { link: string; title: string };

export type StoryGroup = {
    name: string;
    links: Array<StoryLink>;
};

export type Story = StoryLink | StoryGroup;

export type Stories = Array<Story>;

export type StoriesDocument = {
    description?: string;
    published: string;
    stories: Stories;
};
