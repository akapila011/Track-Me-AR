import React, {Component} from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export class DetailView extends Component {
    render() {
        const {trackingCode, startTime, endTime, forceStoppedAt, duration, locations} = this.props.trackingSession;
        return (
            <div>
                <h3>{trackingCode}</h3>
                <ArrowBackIcon onClick={this.props.backToSearchResults}/>
                <span>Started: {startTime}</span>
                <span>Ended: {forceStoppedAt || endTime}</span>
                <span>Duration: {duration}</span>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell align="right">Location</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {locations.map((row) => (
                                <LocationRow
                                    item={row}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

class LocationRow extends Component {
    render() {
        const {id, key, latitude, longitude, time} = this.props.item;
        return (
            <TableRow id={id} key={key} onHover={() => {console.log(id)}}>
                <TableCell>{time}</TableCell>
                <TableCell align="right">{latitude}, {longitude}</TableCell>
            </TableRow>
        );
    }
}