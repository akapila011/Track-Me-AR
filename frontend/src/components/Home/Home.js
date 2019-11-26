import React, {Component} from 'react';
import {Grid} from "@material-ui/core/es/index";
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
          <Grid container spacing={3} id="home">
              <Grid item xs={12}>
                  <h2>Track Me AR</h2>
              </Grid>
              <ViewTracking/>

          </Grid>
      )
   }
}