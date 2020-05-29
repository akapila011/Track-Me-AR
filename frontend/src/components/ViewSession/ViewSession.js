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
                <h3>Tracking Session: <span style={{color: "orange"}}>{this.props.trackingCode}</span></h3>
                <ViewTracking
                    mapWidth={"92vw"}
                    mapHeight={"78vh"}
                    trackingCode={this.props.trackingCode}
                />
            </Grid>
        )
    }
}