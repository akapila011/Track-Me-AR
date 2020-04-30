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
import {isArray, isGeolocationAvailable, setCoords} from "../../util/util";
import {TRACK_SESSION_URL} from "../../util/urls";

export class ViewTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "map",  // map or ar

            isGeolocationAvailable: false,
            coords: {}, // latitude & longitude

            tracking: null, // object of session being tracked
        };
    }

    eventSource = null;  // gets updated once tracking code found

    componentDidMount() {
        const trackingCode = this.props.trackingCode;
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

        const _this = this;
        if (!!window.EventSource && trackingCode) {
            this.eventSource = new EventSource(`${TRACK_SESSION_URL}/${trackingCode}`);

            this.eventSource.addEventListener('message', function(e) {
                console.log("TRACK_SESSION_URL message ", e.data);
                try {
                    const json = JSON.parse(e.data);
                    if (json.latitude && json.longitude && json.trackingCode && json.time && json.startTime && json.endTime) {
                        _this.setState({tracking: json});
                    }
                } catch (e) {
                    console.error("TRACK_SESSION_URL message ERROR ", e)
                }
            }, false)

            this.eventSource.addEventListener('open', function(e) {
                console.log(TRACK_SESSION_URL, "Connection was opened");
            }, false)

            this.eventSource.addEventListener('error', function(e) {
                if (e.readyState === EventSource.CLOSED) {
                    console.log(TRACK_SESSION_URL, "Connection was closed");
                }
            }, false)
        }
    }

    render() {
        const isGeolocationAvailable = this.state.isGeolocationAvailable;
        const coords = this.state.coords;
        // const coords = null;

        let center = coords && coords.latitude && coords.longitude ? [coords.latitude, coords.longitude]: [-1.272007, 36.81425];
        // console.log("center ", center);
        let zoom = coords && coords.latitude && coords.longitude ? 15 : 12;

        const tracking = this.state.tracking;
        const trackingPos = tracking && tracking.latitude && tracking.longitude ? [tracking.latitude, tracking.longitude] : [];

        const viewMap = this.state.view === "map";
        const viewAR = this.state.view === "ar";

        const sessionLocations = isArray(this.props.sessionLocations) ? this.props.sessionLocations : [];
        const hasSessionLocations = sessionLocations.length > 0;
        center = hasSessionLocations ? [sessionLocations[0].latitude, sessionLocations[0].longitude] : center;
        zoom = hasSessionLocations ? 15 : zoom;

        const isZoomedLocation = this.props.zoomedLocation && this.props.zoomedLocation.latitude &&
            this.props.zoomedLocation.longitude && this.props.zoomedLocation.time;
        const zoomedLat = isZoomedLocation ? this.props.zoomedLocation.latitude : null;
        const zoomedLong = isZoomedLocation ? this.props.zoomedLocation.longitude : null;
        const zoomedTime = isZoomedLocation ? this.props.zoomedLocation.time : null;
        // console.log("isZoomedLocation ", isZoomedLocation);
        center = isZoomedLocation ? [zoomedLat, zoomedLong] : center;
        zoom = isZoomedLocation ? 17 : zoom;

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
                    <Container id="map">
                        <Map center={center} zoom={zoom} width={700} height={450} attribution={false}>
                            {
                                !hasSessionLocations && isGeolocationAvailable && coords &&
                                <Marker anchor={center} payload={1} style={{color: "red"}}
                                        onClick={({event, anchor, payload}) => {
                                            console.log("Marker Click ", event)
                                            console.log("Marker Click ", anchor)
                                            console.log("Marker Click ", payload)
                                        }}/>
                            }
                            {
                                !hasSessionLocations && tracking && trackingPos.length == 2 &&
                                <Marker anchor={trackingPos} payload={1} style={{color: "blue"}}
                                        onClick={({event, anchor, payload}) => {
                                            console.log("Tracking Click ", event)
                                            console.log("Tracking Click ", anchor)
                                            console.log("Tracking Click ", payload)
                                        }}/>
                            }
                            {
                                !tracking && hasSessionLocations &&
                                sessionLocations.map((row) => (
                                    <Marker anchor={[row.latitude, row.longitude]} payload={1} style={{color: "green"}}
                                            onClick={({event, anchor, payload}) => {
                                                console.log("time ", row.time);
                                            }}/>
                                ))
                            }
                        </Map>
                    </Container>

                </Grid>


                {/*<Grid item xs={12}>*/}
                {/*    <BottomNavigation*/}
                {/*        value={this.state.view}*/}
                {/*        onChange={(event, newValue) => {*/}
                {/*            this.setState({view: newValue});*/}
                {/*        }}*/}
                {/*        showLabels*/}
                {/*        className={{*/}
                {/*            width: 500,*/}
                {/*        }}*/}
                {/*    >*/}

                {/*        <BottomNavigationAction value="map" label="Map View" icon={<LocationOnIcon/>}/>*/}
                {/*        <BottomNavigationAction value="ar" label="AR View" icon={<AdjustIcon/>}/>*/}
                {/*    </BottomNavigation>*/}
                {/*</Grid>*/}
            </Grid>
        )
    }
}