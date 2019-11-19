import express from 'express';
import {getBaseUrl, isDev} from "./util/config";


const BASE_URL = getBaseUrl();

const app = express();

app.get(`/`, (req, res) => {res.send('Hello World!');});


if (isDev()){
    app.listen(5000, () => {
        console.log('Server is listening on port 3000')
    });
}

