import express from 'express';
import cors from 'cors';
import {getBaseUrl, isDev} from "./util/config";
import {locationController, userController} from "./controllers";
import makeCallback from './middleware/expresscallback';
import sse from './middleware/sse-middleware';
import mongoose from "mongoose";
const BASE_URL = getBaseUrl();

mongoose.connect('mongodb://127.0.0.1/trackmeardb', {useNewUrlParser: true}); // TODO: get from .env
const db = mongoose.connection;

db.on('error', function() {
    console.error("Unable to connect  too the Database. Cannot start express app!")
});
db.once('open', function() {
    const app = express();

    // we're connected!
    console.log("Connected to database");
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
        res.sseSetup();
        const data = {trackingCode: req.params.trackingCode, latitude: 1.234556, longitude: 4.56789, finished: false, endTime: new Date()};
        res.sseSend(data);
    });

    if (isDev()){
        app.listen(5000, () => {
            console.log(`[${new Date().toString()}] Server is listening on port 5000`)
        });
    }
});



