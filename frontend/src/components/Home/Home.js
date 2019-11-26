import React, {Component} from 'react';
import {Grid} from "@material-ui/core";
import ViewTracking from "../ViewTracking/ViewTracking";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: "map"  // map or ar
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
              <Grid item xs={12}>
                  <h2>Track Me AR</h2>
              </Grid>
              <Grid item xs={6}>
                  <h3>Menu</h3>
              </Grid>
              <Grid item xs={6}>
                  <ViewTracking/>
              </Grid>

          </Grid>
      )
   }
}