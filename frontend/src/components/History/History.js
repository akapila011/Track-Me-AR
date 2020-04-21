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
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {SearchResults} from "./SearchResults";
import {DetailView} from "./DetailView";

export default class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            message: "",
            messageType: "",

            view: "results", // results/detail

            filterDate: new Date(),  // date to look for tracking sessions
            trackingSessions: [
                {id: "1", key: "1",
                    trackingCode: "5GBA72X",
                    startTime: "10:32",
                    duration: "12 minutes",
                    endTime: "10:44",
                    locations: [
                        {time: "12:36", latitude: "-1.23484", longitude: "36.45722"}
                    ]
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

    expandDetails(trackingSession) {
        this.setState({
            view: "detail",
            trackingSession: trackingSession,
        })
    }

    backToSearchResults() {
        this.setState({
            view: "results",
            trackingSession: null,
        })
    }

    render() {
        const {filterDate, trackingSessions, view, trackingSession}  = this.state;
        return (
            <Grid id="history"
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
            >

                <Grid item xs={5} style={{paddingLeft: "1%"}}>
                    <h2>{this.props.name || this.props.email} Tracking History</h2>
                    <Snackbar
                        open={this.state.message}
                        onClose={() => {this.setState({message: "", messageType: ""});}}
                        message={this.state.message}
                    />
                    {
                        this.props.isLoggedIn &&
                        <div>
                            {   view === "results" &&
                            <SearchResults
                                trackingSessions={trackingSessions}
                                dateChanged={this.dateChanged.bind(this)}
                                expandDetails={this.expandDetails.bind(this)}
                            />
                            }
                            {   view === "detail" && trackingSession &&
                            <DetailView
                                trackingSession={trackingSession}
                                backToSearchResults={this.backToSearchResults.bind(this)}
                            />
                            }
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