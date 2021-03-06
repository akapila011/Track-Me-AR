import {getJwtSecretKey} from "./config";

const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');

export function isNullUndefined(variable) {
    return variable == null;
}

export function isString(variable) {
    return typeof variable === 'string' || variable instanceof String;
}

export function isNumber(variable) {
    return typeof variable === 'number';
}

export function isArray(variable) {
    return Array.isArray(variable);
}

/**
 * Checks if object is a valid Date object (i.e. no Date("hello"))
 * Checks if object is a valid Date object (i.e. no Date("hello"))
 * @param date Any object
 * @returns {boolean} true/false
 */
export function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

function generateRandomString(length, allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
    let result           = '';
    const charactersLength = allowedCharacters.length;
    for ( let i = 0; i < length; i++ ) {
        result += allowedCharacters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const codeGenerator = {
    alphaNumeric: (length) => {
        return generateRandomString(length);
    }
};

function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2);
}

export function generateUUID () {  // TODO: change this to use a library later
    // const arr = new Uint8Array((len || 40) / 2);
    // window.crypto.getRandomValues(arr);
    // return Array.from(arr, dec2hex).join('');
    return uuidv4();
}

export function stringHasNumber(myString) {
    return /\d/.test(myString);
}

export const hashing = {
    generateSalt: (saltRounds = 10) => {
        return bcrypt.genSaltSync(saltRounds);
        },
    generateHash: (password, salt) => {
        return bcrypt.hashSync(password, salt);
    },
    passwordsMatch: (plainTextPassword, hash, salt) => {
        return bcrypt.compareSync(plainTextPassword, hash);
    }
};

export function statusCodeToType(httpCode) {
    if (httpCode >= 200 && httpCode <= 299) {
        return "success";
    }
    return "error";
}

export function addSecondsToDate(date, seconds) {
    const myDate = new Date(date);
    return new Date(myDate.setSeconds(date.getSeconds() + seconds));
}

export function getJwtObjectFromHttpRequest(httpRequest) {  // returns {} or object with user data
    let token = {};
    const authHeader = httpRequest.headers["Authorization"];
    if (authHeader) {
        const splitStr = authHeader.split(" ");
        if (splitStr.length === 2 && splitStr[0] === "Bearer") {
            try {
                token = jwt.verify(splitStr[1], getJwtSecretKey());
            } catch (e) {
                console.error(e);
            }
        }
    }
    return token;
}

export function getDayStart(date) {
    const newDate = new Date(date);
    newDate.setHours(0,0,0,0);
    return newDate;
}

export function getDayEnd(date) {
    const newDate = new Date(date);
    newDate.setHours(23,59,59,999);
    return newDate;
}

export function getDisplayDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();

    return  dd + '/' + mm + '/' + yyyy;
}

export function dateDifferenceInMinutes(oldDate, newDate) {
    const diffMs = Math.abs(oldDate - newDate);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return diffMins;
}