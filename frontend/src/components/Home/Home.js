import React, {Component} from 'react';
import {Grid} from "@material-ui/core";
import {ViewTracking} from "../ViewTracking/ViewTracking";
import {TextField, Button} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import axios from "axios/index";
import {getJwt, isGeolocationAvailable, setCoords, showMessage, startLoader, stopLoader} from "../../util/util";
import {SIGN_IN_URL, START_TRACKING_URL} from "../../util/urls";
import Snackbar from '@material-ui/core/Snackbar';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",

            tracking: false,
            trackingCode: {
                value: "",
                error: false,
                helperText: ""
            }
        };
    }

    startTrackingClicked() {
        if (!isGeolocationAvailable) {
            showMessage(this, "warn", "Please allow Geo-Location access in order to track your location");
            return;
        }

        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const sendData = {
                latitude: latitude,
                longitude: longitude,
            };
            this.startTracking(sendData);
        }, (error) => {
            console.log("geo err ", error);
            showMessage(this, "warn", "Could not get your location at this time. Try again later.");
            return;
        });
    }

    startTracking(sendData) {
        startLoader(this);
        axios({
            method: "POST",
            url: START_TRACKING_URL,
            timeout: 15000,
            data: sendData,
            headers: {"Authorization": `Bearer ${getJwt()}`}, // optional
        }).then((response) => {
            console.log("startTracking response ", response);
            let data = response.data;
            if (data.type === "success") { // TODO: should get the tracking code, and event stream url
                showMessage(this, data.type, data.message);
            }
        }).catch((error) => {
            console.error(error.message);
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.statusCode, error.response.data.message);
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }
  
  render () {
      return (
          <Grid id="home"
                container
                direction="row"
                justify="center"
                alignItems="center"
          >
              <Grid item xs={5}>
                  <h2 style={{marginBottom: "30%"}}>Track Me AR</h2>
                  <Snackbar
                      open={this.state.message}
                      onClose={() => {this.setState({message: "", messageType: ""});}}
                      message={this.state.message}
                  />
                  <form autoComplete="off">
                      <TextField id="trackingCode" label="Enter Tracking Code"
                                 required
                                 error={this.state.trackingCode.error}
                                 helperText={this.state.trackingCode.helperText}
                                 placeholder={"e.g. A123B456"}
                                 value={this.state.trackingCode.value}
                                 onChange={(event) => {
                                     const text = event.target.value;
                                     const trackingCode = this.state.trackingCode;
                                     trackingCode.value = text;
                                     trackingCode.error = false;
                                     trackingCode.helperText = "";
                                     if (text.length > 14) {
                                         trackingCode.error = true;
                                         trackingCode.helperText = "Tracking Code cannot be more than 14 characters";
                                     }
                                     this.setState({trackingCode: trackingCode});
                                 }}
                      />
                      <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<SearchIcon />}
                      >
                          Find
                      </Button>
                  </form>
                  <br/>
                  <br/>
                  <div>
                      <br/>
                      OR
                      <br/>
                      <br/>

                      <Button
                          variant="contained"
                          color="secondary"
                          size="large"
                          onClick={this.startTrackingClicked.bind(this)}
                          startIcon={<LocationSearchingIcon />}
                      >
                          Start Tracking Me
                      </Button>
                      <br/>
                      <br/>

                      <span style={{fontSize: "12px"}}>
                          Allow Access to Location Services.
                          <br/>
                          Once you've started tracking you will get a tracking code to share with others or you can send a link for them to quickly view your location.
                      </span>
                  </div>
              </Grid>
              <Grid item xs={7}>
                  <ViewTracking/>
              </Grid>

          </Grid>
      )
   }
}