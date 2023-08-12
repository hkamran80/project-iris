/**
 * Create a `Date` object from a date string in the format of `YYYY-MM-DD`
 * @param date {string} A date in the format of `YYYY-MM-DD`
 * @returns {Date} a `Date` object
 */
export const getDateFromYYYYMMDD = (date: string): Date =>
    new Date(
        parseInt(date.substring(0, 4)),
        parseInt(date.substring(5, 7)) - 1,
        parseInt(date.substring(8, 10)),
    );

/**
 * Convert a `YYYY-MM-DD` date to a date string
 * @param date {string} A date in the format of `YYYY-MM-DD`
 * @returns {string} A date string in the format of `Month Day, Year`
 */
export const dateToString = (date: string): string =>
    getDateFromYYYYMMDD(date).toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

/**
 * Get the current date in the format of `YYYY-MM-DD`
 * @returns {string} A date in the format of `YYYY-MM-DD`
 */
export const getISODate = (
    inputDate: string | undefined = undefined,
): string => {
    const date = inputDate ? getDateFromYYYYMMDD(inputDate) : new Date();
    return new Date(+date - date.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0];
};
