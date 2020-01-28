
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

export function setIdentity(userId, name, email) {
    window.localStorage.setItem("identity", JSON.stringify({userId, name, email}));
}

export function removeIdentity() {
    window.localStorage.removeItem("identity");
}

export function loadIdentityToState(self) {
    const identityString = window.localStorage.getItem("identity");
    if (identityString) {
        const identity = JSON.parse(identityString);
        if (identity.userId && identity.name && identity.email) {
            self.setState(identity); // TODO: don't unpack?
        }
    }
}