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
import {SIGN_UP_URL} from "./util/urls";
import {showMessage, startLoader, stopLoader} from "./util/util";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            name: "",
            email: "",
        };
    }

    render() {
        return (
            <BrowserRouter>
                <NavBar
                    userId={this.state.userId}
                    email={this.state.email}
                    name={this.state.name}
                />

                <Grid>
                    <Route exact={true} path='/' render={() => (
                        <div className="App">
                            <Home/>
                        </div>
                    )}/>
                    <Route path="/view/:trackingId" component={ViewSession} />
                </Grid>
            </BrowserRouter>
        );
    }
}

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

                        <Dialog open={this.state.showSignInForm} onClose={this.closeSignInForm.bind(this)} aria-labelledby="form-dialog-title">
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
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                />
                            </DialogContent>
                            <LinearProgress />
                            <DialogActions>
                                <Button onClick={this.closeSignInForm.bind(this)} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={this.closeSignInForm.bind(this)} color="primary">
                                    Sign In
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <SignUp
                            showRegisterForm={this.state.showRegisterForm}
                            closeRegisterForm={this.closeRegisterForm.bind(this)}
                        />

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
                                    <MenuItem onClick={this.handleClose.bind(this)}>Logout</MenuItem>
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

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",

            firstName: "",
            lastName: "",
            email: "",
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
                showMessage(this, data.type, data.message);
            }
        }).catch((error) => {
            console.error(error.message);
            console.log("got here");
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.log("and in if");

                console.error(error.response.data.statusCode, error.response.data.message);
                showMessage(this, error.response.data.type, error.response.data.message);
            }
            // showMessage(currentPageStore, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }

    render() {
        return (
            <Dialog open={this.props.showRegisterForm} onClose={this.props.closeRegisterForm} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Sign Up to get track sessions for much longer and log & export your tracking history. It is completely free!
                    </DialogContentText>

                        <Snackbar
                            open={this.state.message}
                            onClose={() => {this.setState({message: "", messageType: ""});}}
                            message={this.state.message}
                        />

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
                    {/*<TextField*/}
                        {/*required*/}
                        {/*margin="dense"*/}
                        {/*id="password"*/}
                        {/*label="Password"*/}
                        {/*type="password"*/}
                        {/*fullWidth*/}
                    {/*/>*/}
                </DialogContent>
                {
                    this.state.isLoading &&
                    <LinearProgress />
                }

                <DialogActions>
                    <Button onClick={this.props.closeRegisterForm} color="secondary" disabled={this.state.isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={this.signUpClicked.bind(this)} color="primary" disabled={this.state.isLoading}>
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default App;
