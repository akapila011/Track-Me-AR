import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from "./components/Home/Home";
import {BrowserRouter, Route, Link} from 'react-router-dom';
import {AppBar, Grid, Menu, MenuItem, Paper, Tabs, Toolbar, Typography} from "@material-ui/core";
import ViewTracking from "./components/ViewTracking/ViewTracking";
import Tab from "@material-ui/icons/esm/Tab";
import HomeIcon from '@material-ui/icons/Home';
import Button from '@material-ui/core/Button';

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
                    <Route path="/view/:trackingId" component={ViewTracking} />
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

                        {   !isLoggedIn &&
                        <Grid item >
                            <Button color="primary">Sign In</Button>
                            <Button color="secondary">Register</Button>
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

export default App;
