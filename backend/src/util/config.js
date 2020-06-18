import dotenv from 'dotenv';

dotenv.config();

export function getEnvironment() {
    return process.env.ENV;
}

export function isDev() {
    return getEnvironment() === "dev";
}

export function isStage() {
    return getEnvironment() === "stage";
}

export function isProd() {
    return getEnvironment() === "prod";
}

export function getBaseUrl() {
    return process.env.BASE_URL;
}

export function getJwtSecretKey() {
    return process.env.JWT_SECRET_KEY;
}

export function getDatabaseHost() {
    return process.env.DB_HOST
}

export function getDatabasePort() {
    return process.env.DB_PORT
}

export function getDatabaseName() {
    return process.env.DB_NAME
}

export function getBrokerHost() {
    return process.env.message_broker_host
}

export function getBrokerPort() {
    return process.env.message_broker_port
}

export function getBrokerMainTopic() {
    return process.env.message_broker_main_topic
}