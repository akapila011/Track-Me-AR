
export function startLoader(self) {
    self.setState({isLoading: true});
}

export function stopLoader(self) {
    self.setState({isLoading: false});
}

export function showMessage(self, type, message, timeout = 3000) {
    console.log("setting message ", message);
    self.setState({message: message, messageType: type}, () => {
        if (!isNaN(timeout)) {
            setTimeout(() => {self.setState({message: "", messageType: ""});}, 3000)
        }
    });
}

export function isGeolocationAvailable() {
    return navigator.geolocation;
}

export function setCoords(self, latitude, longitude) {
    self.setState({coords: {latitude: latitude, longitude: longitude}});
}

export function setIdentity(userId, name, email, jwt) {
    window.localStorage.setItem("identity", JSON.stringify({userId, name, email, jwt}));
}

export function getJwt() {
    const identityString = window.localStorage.getItem("identity");
    if (identityString) {
        const identity = JSON.parse(identityString);
        return identity.jwt;
    }
}

export function removeIdentity() {
    window.localStorage.removeItem("identity");
}

export function loadIdentityToState(self) {
    const identityString = window.localStorage.getItem("identity");
    if (identityString) {
        const identity = JSON.parse(identityString);
        if (identity.userId && identity.name && identity.email) {
            self.setState({userId: identity.userId, name: identity.name, email: identity.email});
        }
    }
}

/**
 * Checks if object is a valid Date object (i.e. no Date("hello"))
 * Checks if object is a valid Date object (i.e. no Date("hello"))
 * @param date Any object
 * @returns {boolean} true/false
 */
export function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

export function isArray(variable) {
    return Array.isArray(variable);
}