import React, {Component} from 'react';
import {Grid, Container} from "@material-ui/core";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AdjustIcon from '@material-ui/icons/Adjust';

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
            <Grid container id="view-location-container">
                <Grid item xs={12}>
                {
                    viewMap &&
                    <Container fixed id="map">
                        <img src={mapPlaceholder} alt="Map" width="1000" height="600"/>
                    </Container>
                }
                {
                    viewAR &&
                    <Container fixed id="ar">
                        <img src={arPlaceholder} alt="Augmented Reality" width="1000" height="600"/>
                    </Container>
                }
                </Grid>


                <Grid item xs={12}>
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
                        <BottomNavigationAction value="ar" label="AR View" icon={<AdjustIcon/>}/>
                    </BottomNavigation>
                </Grid>
            </Grid>
        )
    }
}