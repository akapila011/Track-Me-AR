import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';

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

export function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
