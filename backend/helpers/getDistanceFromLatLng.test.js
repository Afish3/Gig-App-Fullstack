const { getDistanceFromLatLng } = require('./getDistanceFromLatLng');

describe('getDistanceFromLatLonInMiles', () => {
    it('should calculate distance correctly for two points in the same location', () => {
        const distance = getDistanceFromLatLng(37.7749, -122.4194, 37.7749, -122.4194);
        expect(distance).toBe(0);
    });

    it('should calculate distance correctly for two points in different locations in miles', () => {
        const distance = getDistanceFromLatLng(37.7749, -122.4194, 34.0522, -118.2437);
        // The distance between San Francisco and Los Angeles is approximately 347.42 miles.
        expect(distance).toBeCloseTo(347.42, 1); // Allowing for some rounding error
    });

    it('should calculate distance correctly for two points in different locations in kilometers', () => {
        const distance = getDistanceFromLatLng(37.7749, -122.4194, 34.0522, -118.2437, "km");
        // The distance between San Francisco and Los Angeles is approximately 559.12 km.
        expect(distance).toBeCloseTo(559.12, 1); // Allowing for some rounding error
    });
});