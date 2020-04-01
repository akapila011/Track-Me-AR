/**
 * Build out the json object to be published to the broker
 * Using a builder function to keep properties consistent
 * @param trackingCode
 * @param latitude
 * @param longitude
 * @param finished
 * @param startTime
 * @param endTime
 * @param time
 * @returns {{latitude: *, trackingCode: *, finished: *, startTime: *, endTime: *, time: *, longitude: *}}
 */
export function buildPublishPayloadObject({trackingCode, latitude, longitude, finished, startTime, endTime, time}) {
    return {trackingCode: trackingCode, latitude: latitude, longitude: longitude,
        finished: finished, startTime: startTime, endTime: endTime,
        time: time};
}