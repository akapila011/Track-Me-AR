const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
import {isDev} from "./config";

const consoleTransport = new transports.Console();
const rotateFileTransport = new (transports.DailyRotateFile)({
    filename: 'trackmear-%DATE%.log',
    dirName: "logs", // from config
    datePattern: 'YYYY-MM-DD-HH-ss',
    utc: true,
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '31d'
});

rotateFileTransport.on('rotate', function(oldFilename, newFilename) {
    const msg = `LOGGER -> rotating from ${rotateFileTransport} to ${newFilename}`;
    console.log(msg);
    log.info(msg);
});



const { combine, timestamp, printf } = format;
const applicationLogFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const myWinstonOptions = {
    level: "silly",  // from config
    transports: [
        rotateFileTransport
    ],
    format: combine(
        timestamp(),
        applicationLogFormat
    ),
};

if (isDev()) {
    myWinstonOptions.transports.push(consoleTransport);
}

export const log = new createLogger(myWinstonOptions);