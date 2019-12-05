import React, {Component} from 'react';
import {Grid, Container} from "@material-ui/core";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AdjustIcon from '@material-ui/icons/Adjust';
import {geolocated} from 'react-geolocated';

import mapPlaceholder from "../../assets/images/map-placeholder.jpg";
import arPlaceholder from "../../assets/images/ar-placeholder.png";

class ViewTrackingChild extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "map"  // map or ar
        };
    }

    render() {
        const isGeolocationAvailable = this.props.isGeolocationAvailable;
        const coords = this.props.coords;

        const center = coords && coords.latitude && coords.longitude ? [coords.longitude, coords.latitude]: [36.81425, -1.272007];
        // console.log("center ", center);
        const zoom = coords && coords.latitude && coords.longitude ? 15 : 12;

        const viewMap = this.state.view === "map";
        const viewAR = this.state.view === "ar";

        return (
            <Grid container id="view-location-container">
                { isGeolocationAvailable && coords &&
                <span>Location <span style={{color: "green"}}>Available</span>: {coords.latitude}, {coords.longitude}</span>
                }
                { isGeolocationAvailable && !coords &&
                <span>Location <span style={{color: "red"}}>Not Available</span></span>
                }
                { !isGeolocationAvailable &&
                <span>Location is not supported in your current browser</span>
                }
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

export const ViewTracking = geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
})(ViewTrackingChild);