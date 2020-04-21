import React, {Component} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {TextField} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";

export class SearchResults extends Component {
    render() {
        const trackingSessions = this.props.trackingSessions;
        return (
            <div>
                <form noValidate>
                    <TextField
                        id="datetime-local"
                        label="Filter Date"
                        type="datetime-local"
                        defaultValue={new Date()}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tracking Code</TableCell>
                                <TableCell align="right">Started</TableCell>
                                <TableCell align="right">Duration</TableCell>
                                <TableCell align="right">Ended</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trackingSessions.map((row) => (
                                <TrackingSessionsRow
                                    item={row}
                                    expandDetails={() => {this.props.expandDetails(row);}}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

class TrackingSessionsRow extends Component {
    render() {
        const {id, key, trackingCode, startTime, duration, endTime} = this.props.item;
        return (
            <TableRow id={id} key={key}>
                <TableCell>{trackingCode}</TableCell>
                <TableCell align="right">{startTime}</TableCell>
                <TableCell align="right">{duration}</TableCell>
                <TableCell align="right">{endTime}</TableCell>
                <TableCell align="right" onClick={this.props.expandDetails}> <ChevronRightIcon/></TableCell>
            </TableRow>
        );
    }
}
