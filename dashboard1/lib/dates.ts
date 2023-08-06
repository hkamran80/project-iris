/**
 * Convert a `YYYY-MM-DD` date to a date string
 * @param date {string} A date in the format of `YYYY-MM-DD`
 * @returns {string} A date string in the format of `Month Day, Year`
 */
export const dateToString = (date: string): string =>
    new Date(
        parseInt(date.substring(0, 4)),
        parseInt(date.substring(5, 7)) - 1,
        parseInt(date.substring(8, 10)),
    ).toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
