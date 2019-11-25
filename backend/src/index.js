import express from 'express';
import {getBaseUrl, isDev} from "./util/config";
import {userController} from "./controllers";


const BASE_URL = getBaseUrl();

const app = express();

app.use(express.json());

app.get(`/`, (req, res) => {res.send('Hello World!');});
app.post(`/saveUser`, userController.saveUserController);



if (isDev()){
    app.listen(5000, () => {
        console.log('Server is listening on port 5000')
    });
}

