const { formatAvailability } = require('./availabilityDateFormatting');
const { BadRequestError } = require('../expressError');

describe('formatAvailability', () => {
    it('should parse valid SQL escaped JSON object and return an array of availability objects', () => {
        const validInput = '{"{\"start\":\"2024-01-08T07:00:00.000Z\",\"end\":\"2024-01-20T07:00:00.000Z\"}"}';
        const result = formatAvailability(validInput);
        expect(result).toEqual([
            { start: '2024-01-08T07:00:00.000Z', end: '2024-01-20T07:00:00.000Z' }
        ]);
    });

    it('works for longer input strings with multiple availability objects', () => {
        const inputString =
          '{"{\"start\":\"2024-01-09T07:00:00.000Z\",\"end\":\"2024-01-12T07:00:00.000Z\"}",' +
          '"{\"start\":\"2024-01-16T07:00:00.000Z\",\"end\":\"2024-01-19T07:00:00.000Z\"}",' +
          '"{\"start\":\"2024-01-21T07:00:00.000Z\",\"end\":\"2024-01-24T07:00:00.000Z\"}"}';
    
        const result = formatAvailability(inputString);
    
        // Assert the result is an array with the expected length
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(3);
    
        // Check that the output is a valid array of objects
        result.forEach((availability) => {
          expect(availability).toBeInstanceOf(Object);
          expect(availability).toHaveProperty('start');
          expect(availability).toHaveProperty('end');
        });
      });

    it('should throw a BadRequestError for invalid JSON input', () => {
        const invalidInput = 'invalid-json';
        expect(() => formatAvailability(invalidInput)).toThrow(BadRequestError);
    });
});

