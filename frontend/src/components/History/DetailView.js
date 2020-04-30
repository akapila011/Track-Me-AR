import React, {Component} from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Grid from "@material-ui/core/Grid";
import MyLocationIcon from '@material-ui/icons/MyLocation';

export class DetailView extends Component {
    render() {
        const {trackingCode, startTime, endTime, forceStoppedAt, duration, locations} = this.props.trackingSession;
        const finishedTime = forceStoppedAt || endTime;
        const zoomedLocation = this.props.zoomedLocation;
        return (
            <Grid container justify="space-around">
                <ArrowBackIcon onClick={this.props.backToSearchResults}/>
                <br/><br/>
                <span><strong style={{color: "orange", fontSize: "22px"}}>{trackingCode}</strong></span>
                <br/>

                <Grid direction={"row"}>
                    <span style={{fontSize: "14px"}}>Started: <strong>{new Date(startTime).toLocaleTimeString()}</strong></span>
                    <br/>
                    <span style={{fontSize: "14px", fontStyle: "italic"}}>Duration: <strong>{duration}</strong> minutes</span>
                    <br/>
                    <span style={{fontSize: "14px"}}>Ended: <strong>{new Date(finishedTime).toLocaleTimeString()}</strong></span>
                </Grid>

                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell align="right">Location</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {locations.map((row) =>
                                {
                                    const isZoomedLocation = zoomedLocation ? row.id === zoomedLocation.id : false;
                                    return (
                                        <LocationRow
                                            item={row}
                                            isZoomedLocation={isZoomedLocation}
                                            goToLocation={() => {this.props.goToLocation(isZoomedLocation ? null : row);}}
                                            resetZoomedLocation={() => {this.props.resetZoomedLocation(row);}}
                                        />
                                    )
                                }
                                )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        )
    }
}

class LocationRow extends Component {
    render() {
        const {id, key, latitude, longitude, time} = this.props.item;
        const zoomButtonColor = this.props.isZoomedLocation ? "orange" : "black";
        // console.log("zoomButtonColor ", zoomButtonColor);
        return (
            <TableRow id={id} key={key} onHover={() => {console.log(id)}}>
                <TableCell>{new Date(time).toLocaleTimeString()}</TableCell>
                <TableCell align="right">{latitude}, {longitude}</TableCell>
                <TableCell align="right"  onClick={this.props.goToLocation}>
                    <MyLocationIcon style={{fill: zoomButtonColor}}/></TableCell>
            </TableRow>
        );
    }
}