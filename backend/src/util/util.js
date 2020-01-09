const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

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
    if (httpCode >= 200 || httpCode <= 299) {
        return "success";
    }
    return "error";
}