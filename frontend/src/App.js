import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Home from "./components/Home/Home";
import {BrowserRouter, Route, Link} from 'react-router-dom';
import {AppBar, Grid, Menu, MenuItem, Toolbar, LinearProgress, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';
import ViewSession from "./components/ViewSession/ViewSession";
import {SIGN_IN_URL, SIGN_UP_URL, VERIFY_USER_URL} from "./util/urls";
import {loadIdentityToState, removeIdentity, setIdentity, showMessage, startLoader, stopLoader} from "./util/util";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            name: "",
            email: "",
        };
    }

    componentDidMount() {
        loadIdentityToState(this);
    }

    setGlobalLoggedInDetails(userId, name, email, jwt) {
        this.setState({
            userId: userId,
            name: name,
            email: email
        }, () => {
            setIdentity(userId, name, email, jwt);
        });
    }

    clearGlobalLoggedInDetails() {
        this.setState({userId: "", name: "", email: ""}, () =>{
            removeIdentity();
        })
    }

    render() {
        return (
            <BrowserRouter>
                <NavBar
                    userId={this.state.userId}
                    email={this.state.email}
                    name={this.state.name}
                    setGlobalLoggedInDetails={this.setGlobalLoggedInDetails.bind(this)}
                    clearGlobalLoggedInDetails={this.clearGlobalLoggedInDetails.bind(this)}
                />

                <Grid>
                    <Route exact={true} path='/' render={() => (
                        <div className="App">
                            <Home/>
                        </div>
                    )}/>
                    <Route path="/view/:trackingCode" render={({match}) => (
                        <ViewSession
                            trackingCode={match.params.trackingCode}
                        /> )}
                        />
                </Grid>
            </BrowserRouter>
        );
    }
}

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageType: "",
            message: "",

            menuAnchor: null,
        }
    }

    handleClick(event) {
        this.setState({menuAnchor: event.currentTarget});
    }

    handleClose() {
        this.setState({menuAnchor: null});
    }

    closeSignInForm() {
        this.setState({showSignInForm: false});
    }

    closeRegisterForm() {
        this.setState({showRegisterForm: false});
    }

    handleLogout() {
        this.props.clearGlobalLoggedInDetails();
        this.handleClose();
    }

    render() {
        const isLoggedIn = this.props.userId !== "";
        return (
            <AppBar position="static" style={{backgroundColor: "#FFFFFF", marginBottom: 50}}>
                <Toolbar>
                    <Grid
                        justify="space-between" // Add it here :)
                        container
                        spacing={24}
                    >
                        <Grid item>
                            <Link to={"/"}>
                                <HomeIcon/>
                            </Link>
                        </Grid>

                        <Snackbar
                            open={this.state.message}
                            onClose={() => {this.setState({message: "", messageType: ""});}}
                            message={this.state.message}
                        />

                        {
                            this.state.showSignInForm &&
                            <SignInDialog
                                showSignInForm={this.state.showSignInForm}
                                closeSignInForm={this.closeSignInForm.bind(this)}
                                showMessage={(type, message) => {showMessage(this, type, message)}}
                                setGlobalLoggedInDetails={this.props.setGlobalLoggedInDetails}
                            />
                        }

                        {
                            this.state.showRegisterForm &&
                            <SignUpDialog
                                showRegisterForm={this.state.showRegisterForm}
                                closeRegisterForm={this.closeRegisterForm.bind(this)}
                                showMessage={(type, message) => {showMessage(this, type, message)}}
                            />
                        }


                        {   !isLoggedIn &&
                        <Grid item >
                            <Button color="primary" onClick={() => {this.setState({showSignInForm: true});}}>Sign In</Button>
                            <Button color="secondary" onClick={() => {this.setState({showRegisterForm: true});}}>Register</Button>
                        </Grid>
                        }

                        {   isLoggedIn &&
                        <Grid item >
                            <div>
                                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick.bind(this)}>
                                    {this.props.name}
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.menuAnchor}
                                    getContentAnchorEl={null}
                                    keepMounted
                                    open={Boolean(this.state.menuAnchor)}
                                    onClose={this.handleClose.bind(this)}
                                >
                                    <MenuItem onClick={this.handleClose.bind(this)}>{this.props.email}</MenuItem>
                                    <MenuItem onClick={this.handleLogout.bind(this)}>Logout</MenuItem>
                                </Menu>
                            </div>
                        </Grid>
                        }

                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
}

class SignInDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",

            email: "",
            password: "",
        }
    }

    signInClicked() {
        startLoader(this);
        const sendData = {email: this.state.email, password: this.state.password};
        axios({
            method: "POST",
            url: SIGN_IN_URL,
            timeout: 10000,
            data: sendData,
        }).then((response) => {
            // console.log("signInClicked response ", response);
            let data = response.data;
            if (data.type === "success") {
                this.props.setGlobalLoggedInDetails(data.userId, data.name, data.email, data.jwt);
                this.props.closeSignInForm();
                this.props.showMessage(data.type, data.message);
            }
        }).catch((error) => {
            console.error(error.message);
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.type, error.response.data.message);
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }

    render() {
        return (
            <Dialog open={this.props.showSignInForm} onClose={this.props.closeSignInForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sign In</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sign to enjoy an enhanced experience.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={this.state.email}
                        onChange={(event) => {this.setState({email: event.target.value});}}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={this.state.password}
                        onChange={(event) => {this.setState({password: event.target.value});}}
                    />
                </DialogContent>
                {
                    this.state.isLoading &&
                    <LinearProgress />
                }
                <DialogActions>
                    <Button onClick={this.props.closeSignInForm} color="secondary" disabled={this.state.isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={this.signInClicked.bind(this)} color="primary" disabled={this.state.isLoading}>
                        Sign In
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

class SignUpDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",
            view: "RegisterUser",

            firstName: "",
            lastName: "",
            email: "",

            password: "",
            verificationCode: "",
        }
    }

    signUpClicked() {
        startLoader(this);
        const sendData = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email};
        axios({
            method: "POST",
            url: SIGN_UP_URL,
            timeout: 10000,
            data: sendData,
        }).then((response) => {
            // console.log("signUpClicked response ", response);
            let data = response.data;
            if (data.type === "success") {
                this.setState({view: "VerifyUser"});
                showMessage(this, data.type, data.message);
            }
        }).catch((error) => {
            console.error(error.message);
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.type, error.response.data.message);
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }

    verifyClicked() {
        const sendData = {verificationCode: this.state.verificationCode, password: this.state.password};
        if (!sendData.password || sendData.password.length < 8) {
            showMessage(this, "warn", "Password must be at least 8 characters");
            return;
        }

        startLoader(this);
        axios({
            method: "POST",
            url: VERIFY_USER_URL,
            timeout: 8000,
            data: sendData,
        }).then((response) => {
            // console.log("verifyClicked response ", response);
            let data = response.data;
            if (data.type === "success") {
                this.props.closeRegisterForm();
                this.props.showMessage(data.type, data.message);
            }
        }).catch((error) => {
            console.error(error.message);
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.type, error.response.data.message);
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }

    render() {
        return (
            <Dialog open={this.props.showRegisterForm}
                    onClose={this.props.closeRegisterForm}
                    aria-labelledby="form-dialog-title">
                <Snackbar
                    open={this.state.message}
                    onClose={() => {this.setState({message: "", messageType: ""});}}
                    message={this.state.message}
                />
                {
                    this.state.view === "RegisterUser" &&
                    <div>
                        <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Sign Up to get track sessions for much longer and log & export your tracking history. It is completely free!
                            </DialogContentText>

                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                helperText="You will use this email to login. You will be required to verify this email."
                                id="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={this.state.email}
                                onChange={(event) => {this.setState({email: event.target.value});}}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="firstName"
                                label="First Name"
                                type="text"
                                halfWidth
                                value={this.state.firstName}
                                onChange={(event) => {this.setState({firstName: event.target.value});}}
                            />
                            <TextField
                                margin="dense"
                                id="lastName"
                                label="Last Name"
                                type="text"
                                halfWidth
                                value={this.state.lastName}
                                onChange={(event) => {this.setState({lastName: event.target.value});}}
                            />
                        </DialogContent>
                    </div>
                }
                {
                    this.state.view === "VerifyUser" &&
                    <div>
                        <DialogTitle id="form-dialog-title">Confirm Email</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Enter the verification code sent to <span style={{fontWeight: "bold"}}>{this.state.email}</span> to finish sign-up.
                            </DialogContentText>

                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                helperText="Enter the verification code sent to your email"
                                id="verificationCode"
                                label="Verification Code"
                                type="text"
                                fullWidth
                                maxLength={10}
                                placeholder={"e.g. A123B7Y"}
                                value={this.state.verificationCode}
                                onChange={(event) => {this.setState({verificationCode: event.target.value});}}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={this.state.password}
                                onChange={(event) => {this.setState({password: event.target.value});}}
                            />
                        </DialogContent>
                    </div>
                }
                {
                    this.props.isLoading &&
                    <LinearProgress />
                }
                <DialogActions>
                    <Button onClick={this.props.closeRegisterForm} color="secondary" disabled={this.state.isLoading}>
                        Cancel
                    </Button>
                    {
                        this.state.view === "RegisterUser" &&
                        <Button onClick={this.signUpClicked.bind(this)} color="primary" disabled={this.state.isLoading}>
                            Sign Up
                        </Button>
                    }
                    {
                        this.state.view === "VerifyUser" &&
                        <Button onClick={this.verifyClicked.bind(this)} color="primary" disabled={this.state.isLoading}>
                            Verify & Finish
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        )
    }
}

export default App;
