import express from 'express';
import cors from 'cors';
import {getBaseUrl, isDev} from "./util/config";
import {userController} from "./controllers";
import makeCallback from './express-callback';
import mongoose from "mongoose";

const BASE_URL = getBaseUrl();

const app = express();
mongoose.connect('mongodb://127.0.0.1/trackmeardb', {useNewUrlParser: true});
const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', function() {
    console.error("NOT !!!!!!!! Connected to database")
});
db.once('open', function() {
    // we're connected!
    console.log("Connected to database")
});

app.use(cors());
app.use(express.json());

app.get(`/`, (req, res) => {res.send('Hello World!');});
app.post(`/signup`, makeCallback(userController.saveUserController));
app.get(`/verifyUser`, userController.verifyUserController);



if (isDev()){
    app.listen(5000, () => {
        console.log('Server is listening on port 5000')
    });
}

