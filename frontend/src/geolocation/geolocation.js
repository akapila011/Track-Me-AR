
export function isGeolocationAvailable() {
    return navigator.geolocation;
}

let location = null;

export function getCurrentLocation() {
    if (isGeolocationAvailable()) {
        navigator.geolocation.getCurrentPosition((position) => {

        }, (error) => {
        });
    }
}

export function setCoords(self, latitude, longitude) {
    self.setState({coords: {latitude: latitude, longitude: longitude}});
}