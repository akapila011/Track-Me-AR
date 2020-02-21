import React, {Component} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import {ViewTracking} from "../ViewTracking/ViewTracking";
import SearchIcon from '@material-ui/icons/Search';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import BlockIcon from '@material-ui/icons/Block';
import axios from "axios/index";
import {getJwt, isValidDate, showMessage, startLoader, stopLoader} from "../../util/util";
import {FIND_TRACKING_SESSION_URL, START_TRACKING_URL, STOP_TRACKING_URL, TRACK_LOCATION_URL} from "../../util/urls";
import Snackbar from '@material-ui/core/Snackbar';
import Countdown from 'react-countdown';
import {ConfirmDialog} from "../SharedComponents/ConfirmationDialog";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",

            foundSession: null,  // or {} with fields

            tracking: "",
            trackingSecret: null,
            trackingEndTime: null,
            trackingUpdateInterval: null,
            showConfirmStopTracking: false,

            trackingCode: {
                value: "",
                error: false,
                helperText: ""
            }
        };
    }

    trackingIntervalId = null; // js time interval function id to cancel on end and when unmounting

    startTrackingClicked() {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const sendData = {
                latitude: latitude,
                longitude: longitude,
            };
            this.startTracking(sendData);
        }, (error) => {
            showMessage(this, "warn", "Please allow Geo-Location access in order to track your location");
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
            // console.log("startTracking response ", response);
            let data = response.data;
            if (data.type === "success" && data.trackingCode && data.trackingUpdateInterval) { // TODO: should get event stream url
                showMessage(this, data.type, data.message);
                const trackingCode = this.state.trackingCode;
                trackingCode.value = data.trackingCode;
                trackingCode.error = false;
                trackingCode.helperText = "";
                this.setState({trackingCode: trackingCode, tracking: data.trackingCode,
                    trackingEndTime: new Date(data.trackingEndTime), trackingUpdateInterval: data.trackingUpdateInterval,
                    trackingSecret: data.trackingSecret, foundSession: null
                }, () => {
                    this.trackingIntervalId = setInterval(this.updateTracking.bind(this), (data.trackingUpdateInterval * 1000));
                });
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

    updateTracking() {
        // console.log("UPDATE LOCATION ");
        const now = new Date();
        if (now > this.state.trackingEndTime) {
            this.stopTracking();
            showMessage(this, "warn", "Tracking has ended.");
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            const trackingCode = this.state.tracking;
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const sendData = {
                trackingCode: trackingCode,
                latitude: latitude,
                longitude: longitude,
            };
            // console.log("UPDATE LOCATION ", sendData);
            this.postUpdatedTracking(sendData);
        }, (error) => {
            console.log("geo err ", error);
            showMessage(this, "warn", "Unable to get location for update at this time.");
            return;
        });
    }
    
    postUpdatedTracking(sendData) {
        axios({
            method: "POST",
            url: TRACK_LOCATION_URL,
            timeout: 10000,
            data: sendData,
            headers: {"Authorization": `Bearer ${getJwt()}`}, // optional
        }).then((response) => {
            // console.log("postUpdatedTracking response ", response);
            let data = response.data;
            if (data.type === "success" && data.finished) {
                showMessage(this, data.type, data.message);
                this.stopTracking();
            }
        }).catch((error) => {
            console.error(error.message);
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.type, error.response.data.message);
                if (error.response.status === 310) {
                    this.stopTracking();
                }
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }

    stopTracking() {
        const trackingCode = this.state.trackingCode;
        trackingCode.value = "";
        trackingCode.error = false;
        trackingCode.helperText = "";
        this.setState({trackingCode: trackingCode, tracking: "", trackingSecret: null, trackingEndTime: null}, () => {
            clearInterval(this.trackingIntervalId);
        });
    }

    componentWillUnmount() {
        clearInterval(this.trackingIntervalId);
    }
    
    isTrackingMe() {
        return this.state.tracking && isValidDate(this.state.trackingEndTime) && this.state.trackingUpdateInterval;
    }

    closeShowConfirmStopTracking() {
        this.setState({showConfirmStopTracking: false});
    }

    confirmStopTracking() {
        startLoader(this);
        const sendData = {trackingCode: this.state.tracking};
        axios({
            method: "POST",
            url: STOP_TRACKING_URL,
            timeout: 15000,
            data: sendData,
            headers: {"Authorization": `Bearer ${getJwt()}`}, // optional
        }).then((response) => {
            // console.log("stopTracking response ", response);
            let data = response.data;
            if (data.type === "success") {
                this.stopTracking();
                this.closeShowConfirmStopTracking();
                showMessage(this, data.type, data.message);
            }
        }).catch((error) => {
            console.error(error.message);
            this.closeShowConfirmStopTracking();
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.type, error.response.data.message);
                if (error.response.status === 310) {
                    this.stopTracking();
                }
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
    }

    findTrackingSession() {
        if (!this.state.trackingCode || !this.state.trackingCode.value) {
            return showMessage(this, "warn", "Please enter a Tracking code to find");
        }
        startLoader(this);
        const sendData={trackingCode: this.state.trackingCode.value};
        axios({
            method: "POST",
            url: FIND_TRACKING_SESSION_URL,
            timeout: 12000,
            data: sendData,
            headers: {"Authorization": `Bearer ${getJwt()}`}, // optional
        }).then((response) => {
            // console.log("findTrackingSession response ", response);
            let data = response.data;
            if (data.type === "success" && data.startTime && data.endTime) { // TODO: should get event stream url
                showMessage(this, data.type, data.message);
                const foundSession = {
                    trackingCode: data.trackingCode,
                    startTime: new Date(data.startTime),
                    endTime: new Date(data.endTime),
                    url: data.url,
                    finished: data.finished,
                };
                this.setState({foundSession: foundSession});
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

    isSessionFound() {
        return this.state.foundSession && isValidDate(this.state.foundSession.startTime) && isValidDate(this.state.foundSession.endTime);
    }

    render () {
        const isTrackingMe = this.isTrackingMe();
        const isSessionFound = this.isSessionFound();
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
                  {
                      !isTrackingMe &&
                      <div>
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
                                  onClick={this.findTrackingSession.bind(this)}
                                  startIcon={<SearchIcon/>}
                              >
                                  Find
                              </Button>
                          </form>
                          <br/>
                          <br/>
                          {
                              isSessionFound &&
                                  <div>
                                      <span>Currently Tracking Session <strong style={{color: "orange", fontSize: "22px"}}>{this.state.foundSession.trackingCode}</strong></span>
                                      <span style={{fontSize: "12px"}}>Started At: {this.state.foundSession.startTime.toString()}</span>
                                      <span style={{fontSize: "12px"}}>Finishes At: {this.state.foundSession.endTime.toString()}</span>
                                      {
                                          !this.state.foundSession.finished &&
                                              <div>
                                                  <br/>
                                                  <span style={{fontSize: "16px"}}>Session ends in
                                                      <span style={{color: "orange", fontSize: "20px"}}>
                                                          <Countdown date={this.state.foundSession.endTime}
                                                                     onComplete={() => {
                                                                         const foundSession = this.state.foundSession;
                                                                         if (foundSession) {foundSession.finished = true;}
                                                                         this.setState({foundSession: foundSession});
                                                                     }}/>
                                                      </span>
                                                  </span>
                                                  <br/>
                                              </div>
                                      }
                                  </div>
                          }
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
                                  startIcon={<LocationSearchingIcon/>}
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
                      </div>
                  }
                  {
                      isTrackingMe &&
                          <div>
                              <span style={{fontSize: "18x"}}>Currently Tracking you. Tracking Code is <strong style={{color: "orange", fontSize: "22px"}}>{this.state.tracking}</strong></span>
                              <br/>
                              <span style={{fontSize: "12px"}}>You can share this code with others to track your movement in real-time.</span>
                              <br/>
                              <br/>
                              <span style={{fontSize: "16px"}}>Tracking ends in <span style={{color: "orange", fontSize: "20px"}}><Countdown date={this.state.trackingEndTime} onComplete={this.stopTracking.bind(this)}/></span></span>
                              <br/>
                              <br/>
                              <span style={{fontSize: "12px"}}>Your session will end at {this.state.trackingEndTime.toString()}</span>
                              <br/>
                              <br/>
                              <Button
                                  variant="contained"
                                  color="secondary"
                                  size="large"
                                  onClick={() => {this.setState({showConfirmStopTracking: true});}}
                                  startIcon={<BlockIcon/>}
                              >
                                  Stop Tracking
                              </Button>
                              <ConfirmDialog
                                  open={this.state.showConfirmStopTracking}
                                  close={this.closeShowConfirmStopTracking.bind(this)}
                                  isLoading={this.state.isLoading}
                                  title={"Confirm Stop Tracking"}
                                  contentText={"Are you sure you want to stop tracking your location? Your location will no longer be broadcast to people you may have shared the code with."}
                                  negativeText={"No"}
                                  negativeAction={this.closeShowConfirmStopTracking.bind(this)}
                                  positiveText={"Stop Tracking"}
                                  positiveAction={this.confirmStopTracking.bind(this)}
                              />
                          </div>
                  }
                  
              </Grid>
              <Grid item xs={7}>
                  <ViewTracking/>
              </Grid>

          </Grid>
      )
   }
}