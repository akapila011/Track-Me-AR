import React, {Component} from 'react';
import {Grid} from "@material-ui/core";
import {ViewTracking} from "../ViewTracking/ViewTracking";

export default class ViewSession extends Component {
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
            <Grid id="viewSession"
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
            >
                <Grid item xs={9}>
                    <ViewTracking/>
                </Grid>
                <Grid item xs={3}>
                    <span>data</span>
                </Grid>

            </Grid>
        )
    }
}