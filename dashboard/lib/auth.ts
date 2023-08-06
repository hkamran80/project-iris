const getGithubUserId = (imageUrl: string): string => {
    if (!imageUrl.includes("/")) {
        return "--";
    }

    const components = imageUrl.split("/");
    return components[components.length - 1].split("?")[0];
};

export const checkAuthorized = (imageUrl: string): boolean =>
    (process.env.NEXT_PUBLIC_ALLOWED_USERS as string)
        .split(",")
        .includes(getGithubUserId(imageUrl));
