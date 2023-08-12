import { createHash } from "crypto";
import type { HashOutput, Stories, StoriesDocument } from "./types";

const hash = (content: string) =>
    createHash("sha256").update(content).digest("hex");

const checkStoriesHash = (
    stories: Stories,
    storiesHash: string,
): string | boolean => {
    const generatedHash = hash(JSON.stringify(stories));
    if (generatedHash !== storiesHash) {
        return generatedHash;
    } else {
        return true;
    }
};

const checkDescriptionHash = (
    description: string,
    descriptionHash: string,
): string | boolean => {
    const generatedHash = hash(description);
    if (generatedHash !== descriptionHash) {
        return generatedHash;
    } else {
        return true;
    }
};

export const checkHashes = (
    storiesDocument: StoriesDocument,
    storiesHash: string,
    descriptionHsah: string,
): HashOutput => {
    const storiesHashMatch = checkStoriesHash(
        storiesDocument.stories,
        storiesHash,
    );
    const descriptionHashMatch = checkDescriptionHash(
        storiesDocument.description ?? "",
        descriptionHsah,
    );

    return { stories: storiesHashMatch, description: descriptionHashMatch };
};

export const checkChangedHash = (hashOutput: string | boolean) =>
    typeof hashOutput === "string";
