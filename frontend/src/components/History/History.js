import React, {Component} from 'react';
import {Grid, TextField} from "@material-ui/core";
import {ViewTracking} from "../ViewTracking/ViewTracking";
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",

            filterDate: new Date(),  // date to look for tracking sessions
            trackingSessions: [
                {id: "1", key: "1",
                    trackingCode: "5GBA72X",
                    started: "10:32",
                    duration: "12 minutes",
                    ended: "10:44"
                }
            ], // results from server for the date
            trackingSession: null,  // object holding all info for a selected tracking session
        };
        this.dateChanged.bind(this);
    }

    findSessionsByDate() {

    }

    dateChanged(date) {
        this.setState({filterDate: date}, () => {
            this.findSessionsByDate(this.state.filterDate);
        });
    }

    render() {
        const filterDate = this.state.filterDate;
        const trackingSessions = this.state.trackingSessions;
        return (
            <Grid id="history"
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
            >

                <Grid item xs={5}>
                    <h2 style={{marginBottom: "30%"}}>{this.props.name || this.props.email} Tracking History</h2>
                    <Snackbar
                        open={this.state.message}
                        onClose={() => {this.setState({message: "", messageType: ""});}}
                        message={this.state.message}
                    />
                    {
                        this.props.isLoggedIn &&
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
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {trackingSessions.map((row) => (
                                            <TrackingSessionsRow
                                                item={row}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }
                    {
                        !this.props.isLoggedIn &&
                        <h4 style={{color: "red"}}>You must be logged in to view this page</h4>
                    }
                </Grid>
                <Grid item xs={7}>
                    <ViewTracking
                        location={null}
                    />
                </Grid>

            </Grid>
        )
    }
}

class TrackingSessionsRow extends Component {
    render() {
        const {id, key, trackingCode, started, duration, ended} = this.props.item;
        return (
            <TableRow id={id} key={key}>
                <TableCell>{trackingCode}</TableCell>
                <TableCell align="right">{started}</TableCell>
                <TableCell align="right">{duration}</TableCell>
                <TableCell align="right">{ended}</TableCell>
            </TableRow>
        );
    }
}
