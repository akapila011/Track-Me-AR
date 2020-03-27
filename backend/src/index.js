import express from 'express';
import cors from 'cors';
import {getBaseUrl, getDatabaseHost, getDatabaseName, getDatabasePort, isDev} from "./util/config";
import {locationController, userController} from "./controllers";
import makeCallback from './middleware/expresscallback';
import sse from './middleware/sse-middleware';
import mongoose from "mongoose";
import {subscribedConnections, onMessageConsumerTrackingSessions} from "./broker/LocationBroker";
import {locationService} from "./usecases";
import {log} from "./util/log";

const BASE_URL = getBaseUrl();

mongoose.connect(`mongodb://${getDatabaseHost()}:${getDatabasePort()}/${getDatabaseName()}`, {useNewUrlParser: true});
const db = mongoose.connection;

db.on('error', function() {
    log.error("Unable to connect  too the Database. Cannot start express app!")
});
db.once('open', function() {
    const app = express();

    // we're connected!
    log.info("Connected to database");
    app.use(cors());
    app.use(express.json());

    app.get(`/`, (req, res) => {res.send('Hello World!');});
    app.post(`/signup`, makeCallback(userController.saveUserController));
    app.post(`/verifyUser`, makeCallback(userController.verifyUserController));
    app.post(`/signin`, makeCallback(userController.signinUserController));

    app.post(`/startTracking`, makeCallback(locationController.startTrackingController));
    app.post(`/trackLocation`, makeCallback(locationController.trackLocationController));
    app.post(`/stopTracking`, makeCallback(locationController.stopTrackingController));
    app.post(`/findTrackingSession`, makeCallback(locationController.findTrackingSessionController));
    app.get(`/trackSession/:trackingCode`, [sse], (req, res) => {
        const trackingCode = req.params.trackingCode;
        // TODO: implement a way to remove a session
        locationService.validateTrackSessionUsecase({trackingCode: trackingCode, getLatestLocation: true}).then((response) => {
            if (response.statusCode === 200 && response.latitude && response.longitude) {
                res.sseSetup();
                const data = {trackingCode: trackingCode, latitude: response.latitude, longitude: response.longitude,
                    finished: response.finished, startTime: response.startTime, endTime: response.endTime,
                    time: response.locationTime};
                res.sseSend(data);
                if (!subscribedConnections.has(trackingCode)) {  // initialize for this trackingSession
                    subscribedConnections.set(trackingCode, [{res: res, subscribedAt: new Date()}]);// TODO: figure why array is overwritten with value 1
                    console.log("subscribedConnections setting ", trackingCode);
                    console.log("subscribedConnections keys ", subscribedConnections.keys());
                }
                // console.log("subscribedConnections.get(trackingCode) ", subscribedConnections.get(trackingCode));
                // const newList = subscribedConnections.get(trackingCode).push({res: res, subscribedAt: new Date()});
                // subscribedConnections.set(trackingCode, newList);
            } else {
                log.error(`Problem in trackSession/${trackingCode}, response=${response}`);
                res.type('json');
                res.status(404).send({type: "error", message: response.message});
            }
        }).catch((error) => {
            log.error(`Error while validateTrackSessionUsecase in /trackingSession/${trackingCode}: ${error}`);
            res.type('json');
            res.status(500).send({type: "error", message: "Error while validating tracking session for real time tracking"});
        })
    });
    app.get(`/subscribers`, (req, res) => {
        console.log("subscribedConnections ", subscribedConnections)
        res.status(200).send({type: "success", sessions: subscribedConnections});
    });

    if (isDev()){
        app.listen(5000, () => {
            log.info(`Server is listening on port 5000`)
        });
    }
});



