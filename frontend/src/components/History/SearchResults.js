import React, {Component} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Grid from "@material-ui/core/Grid";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import {isArray} from "../../util/util";

export class SearchResults extends Component {
    render() {
        const trackingSessions = this.props.trackingSessions;
        const isTrackingSessionsEmpty = !isArray(trackingSessions) || trackingSessions.length < 1;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
                <form noValidate>
                    <KeyboardDatePicker
                        margin="normal"
                        id="filter-date-picker-dialog"
                        label="Filter date"
                        format="dd/MM/yyyy"
                        value={this.props.filterDate}
                        onChange={this.props.dateChanged}
                        KeyboardButtonProps={{
                            'aria-label': 'Change Filter Date',
                        }}
                    />
                </form>
                <TableContainer component={Paper} style={{height: "60vh"}}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tracking Code</TableCell>
                                <TableCell align="right">Started</TableCell>
                                <TableCell align="right">Duration (min)</TableCell>
                                <TableCell align="right">Ended</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            !isTrackingSessionsEmpty &&
                            <TableBody>
                                {trackingSessions.map((row) => (
                                    <TrackingSessionsRow
                                        item={row}
                                        expandDetails={() => {this.props.expandDetails(row);}}
                                    />
                                ))}
                            </TableBody>
                        }
                        {   isTrackingSessionsEmpty &&
                            <TableBody>
                                <TableRow id={"noTrackingSessions"} key={"noTrackingSessions"}>
                                    <TableCell colSpan={5} align="center" style={{color: "orange"}}>No Tracking Sessions Found</TableCell>
                                </TableRow>
                            </TableBody>
                        }
                    </Table>
                </TableContainer>
            </Grid>
            </MuiPickersUtilsProvider>
        )
    }
}

class TrackingSessionsRow extends Component {
    render() {
        const {id, key, trackingCode, startTime, duration, endTime} = this.props.item;
        return (
            <TableRow id={id} key={key}>
                <TableCell style={{fontWeight: "bold"}}>{trackingCode}</TableCell>
                <TableCell align="right">{new Date(startTime).toLocaleTimeString()}</TableCell>
                <TableCell align="right">{duration}</TableCell>
                <TableCell align="right">{new Date(endTime).toLocaleTimeString()}</TableCell>
                <TableCell align="right" onClick={this.props.expandDetails}> <ChevronRightIcon/></TableCell>
            </TableRow>
        );
    }
}
