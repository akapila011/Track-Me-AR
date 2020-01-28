import React, {Component} from 'react';
import {Grid, Container} from "@material-ui/core";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AdjustIcon from '@material-ui/icons/Adjust';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'

import mapPlaceholder from "../../assets/images/map-placeholder.jpg";
import arPlaceholder from "../../assets/images/ar-placeholder.png";
import {isGeolocationAvailable, setCoords} from "../../util/util";

export class ViewTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "map",  // map or ar

            isGeolocationAvailable: false,
            coords: {}, // latitude & longitude
        };
    }

    componentDidMount() {
        if (isGeolocationAvailable()) {
            this.setState({isGeolocationAvailable: true});
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude  = position.coords.latitude;
                const longitude = position.coords.longitude;
                setCoords(this, latitude, longitude);
            }, (error) => {
                console.log("geo err ", error);
            });
        }
    }



    render() {
        const isGeolocationAvailable = this.state.isGeolocationAvailable;
        const coords = this.state.coords;

        const center = coords && coords.latitude && coords.longitude ? [coords.latitude, coords.longitude]: [-1.272007, 36.81425];
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
                    <Container id="map">
                        <Map center={center} zoom={zoom} width={1000} height={600} attribution={false}>
                            <Marker anchor={center} payload={1} onClick={({ event, anchor, payload }) => {
                                console.log("Marker Click ", event)
                                console.log("Marker Click ", anchor)
                                console.log("Marker Click ", payload)
                            }} />
                        </Map>
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