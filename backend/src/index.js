import express from 'express';
import cors from 'cors';
import {getBaseUrl, isDev} from "./util/config";
import {userController} from "./controllers";
import makeCallback from './express-callback'


const BASE_URL = getBaseUrl();

const app = express();

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

