import React, {Component} from 'react';
import {Grid, Container} from "@material-ui/core/es/index";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import mapPlaceholder from "../../assets/images/map-placeholder.jpg";
import arPlaceholder from "../../assets/images/ar-placeholder.png";

export default class ViewTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "map"  // map or ar
        };
    }

    render() {
        const viewMap = this.state.view === "map";
        const viewAR = this.state.view === "ar";
        return (
            <Grid item xs={12} id="view-location-container">
                {
                    viewMap &&
                    <Container fixed id="map">
                        <h1>MAP</h1>
                        <img src={mapPlaceholder} alt="Map" width="800" height="500"/>
                    </Container>
                }
                {
                    viewAR &&
                    <Container fixed id="ar">
                        <h1>AR</h1>
                        <img src={arPlaceholder} alt="Augmented Reality" width="800" height="500"/>
                    </Container>
                }

                <BottomNavigation
                    value={this.state.view}
                    onChange={(event, newValue) => {
                        this.setState({view: newValue});
                    }}
                    showLabels
                    className={{
                        width: 500,
                    }}
                >

                    <BottomNavigationAction value="map" label="Map View" icon={<LocationOnIcon/>}/>
                    <BottomNavigationAction value="ar" label="AR View" icon={<LocationOnIcon/>}/>
                </BottomNavigation>
            </Grid>
        )
    }
}