import React, {Component} from 'react';
import {Grid} from "@material-ui/core";
import {ViewTracking} from "../ViewTracking/ViewTracking";
import Snackbar from '@material-ui/core/Snackbar';
import {SearchResults} from "./SearchResults";
import {DetailView} from "./DetailView";
import {getJwt, isArray, showMessage, startLoader, stopLoader} from "../../util/util";
import axios from "axios";
import {USER_SESSIONS_URL} from "../../util/urls";


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
    }

    componentDidMount() {
        this.findSessionsByDate(this.state.filterDate);
    }

    findSessionsByDate(filterDate) {
        const sendData = {filterDate: filterDate};
        startLoader(this);
        axios({
            method: "POST",
            url: USER_SESSIONS_URL,
            timeout: 10000,
            data: sendData,
            headers: {"Authorization": `Bearer ${getJwt()}`},
        }).then((response) => {
            // console.log("findSessionsByDate response ", response);
            let data = response.data;
            if (data.type === "success" && isArray(data.trackingSessions)) {
                showMessage(this, data.type, data.message);
                this.setState({trackingSessions: data.trackingSessions});
            }
        }).catch((error) => {
            console.error(error.message);
            if (error.response && error.response.status && error.response.data && error.response.data.type && error.response.data.message) {
                console.error(error.response.data.type, error.response.data.message);
                showMessage(this, error.response.data.type, error.response.data.message);
                return;
            }
            showMessage(this, "error", error.message);
        }).finally(() => {
            stopLoader(this);
        });  // end axios
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
                                filterDate={filterDate}
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