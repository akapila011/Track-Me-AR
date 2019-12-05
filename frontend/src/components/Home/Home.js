import React, {Component} from 'react';
import {Grid} from "@material-ui/core";
import {ViewTracking} from "../ViewTracking/ViewTracking";
import {TextField, Button} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trackingCode: {
                value: "",
                error: false,
                helperText: ""
            }
        };
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