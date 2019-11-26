import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import Home from "./components/Home/Home";
import {BrowserRouter, Route, Link} from 'react-router-dom';
import {Grid} from "@material-ui/core/es/index";
import ViewTracking from "./components/ViewTracking/ViewTracking";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    </ul>
                </nav>

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

export default App;
