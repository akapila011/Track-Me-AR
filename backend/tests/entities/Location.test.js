import createLocation from "../../src/entities/Location/index";

describe('Entities: createLocation', () => {
    it('Error on empty object data', () => {
        const location = {};
        expect(() => {createLocation(location)}).toThrow();
    });
    it('Invalid types for latitude/longtiude', () => {
        const location = {
            latitude: "1.23", longitude: "4.56", time: new Date(), trackingId: ""
        };
        expect(() => {createLocation(location)}).toThrow();
    });
    it('Latitude must be between 90 & -90', () => {
        const location = {
            latitude: -100, longitude: 0, time: new Date(), trackingId: ""
        };
        expect(() => {createLocation(location)}).toThrow();
        location.latitude = 100;
        expect(() => {createLocation(location)}).toThrow();
    });

    it('Longitude must be between 180 & -180', () => {
        const location = {
            latitude: 0, longitude: -200, time: new Date(), trackingId: ""
        };
        expect(() => {createLocation(location)}).toThrow();
        location.longitude = 200;
        expect(() => {createLocation(location)}).toThrow();
    });
    it('Location created successfully', () => {
        const location = {
            latitude: 0, longitude: 0, time: new Date(), trackingId: ""
        };
        const expectedLocation = Object.freeze({
            getLatitude: () => location.latitude,
            getLongitude: () => location.longitude,
            getTime: () => location.time,
            getTrackingId: () => location.trackingId,
        });
        expect(JSON.stringify(createLocation(location))).toEqual(JSON.stringify(expectedLocation));
    });
});