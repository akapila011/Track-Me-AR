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