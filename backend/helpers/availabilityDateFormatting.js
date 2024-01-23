const { BadRequestError } = require('../expressError');

/**
 * Parses and formats a string of available datetimes from SQL into a JavaScript array.
 *
 * This function takes a string representing availability in a SQL escaped string representation of a 
 * Javascript object and processes it into a well-formatted JavaScript array containing availability information.
 *
 * @param {String} availability - The string representing availability in SQL escaped format.
 * @returns {Array<Object>} An array of availability objects with parsed datetime information.
 * @throws {SyntaxError} If the input string is not a valid JSON array.
 * @example
 * // Example usage:
 * const availabilityString = '{"{\"start\":\"2024-01-08T07:00:00.000Z\",\"end\":\"2024-01-20T07:00:00.000Z\", ...}"}';
 * const formattedAvailability = formatAvailability(availabilityString);
 * console.log(formattedAvailability);
 * // Output: [{ start: '2023-01-01T10:00:00', end: '2023-01-01T12:00:00' }, ...]
 */

function formatAvailability(availability) {
    const rawAvailabilityString = String(availability);
    // Remove sql inserted `\` characters
    const cleanedAvailabilityString = rawAvailabilityString.replace(/\\/g, '');
    // Remove quotation marks before curly braces
    const stringWithoutQuotesBefore = cleanedAvailabilityString.replace(/"({)/g, '$1');
    // Remove quotation marks after curly braces
    const stringWithoutQuotesAfter = stringWithoutQuotesBefore.replace(/(})"/g, '$1');
    const formattedAvailabilityArray = '[' + stringWithoutQuotesAfter.substring(1, stringWithoutQuotesAfter.length - 1) + ']';


    try {
        const parsedAvailabilities = JSON.parse(formattedAvailabilityArray);

        if(!Array.isArray(parsedAvailabilities))  throw new BadRequestError('Input is not a valid JSON array.');

        return parsedAvailabilities;
    } catch (error) {
        throw new BadRequestError('Invalid JSON format. Unable to parse availability string.');
    }
  }

  module.exports = { formatAvailability };