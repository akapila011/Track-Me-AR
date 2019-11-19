import {isNullUndefined, isString, isValidDate} from "./util";


export const idValidator = {
    isValidUUID: (id) => {
        const result = {valid: false, message: ""};
        if (isNullUndefined(id)) {
            result.message = "Missing ID";
            return result;
        }
        if (!isString(id)) {
            result.message = "ID must be a text value";
            return result;
        }
        if (id.length != 32) {
            result.message = "User ID can only be 32 characters";
            return result;
        }
        result.valid = true;
        return result;
    }
};

export const nameValidator = {
    isValidFirstName: (firstName) => {
        const result = {valid: false, message: ""};
        if (isNullUndefined(firstName)) {
            result.message = "Missing first name";
            return result;
        }
        if (!isString(firstName)) {
            result.message = "First name must be a text";
            return result;
        }
        if (firstName.length < 1) {
            result.message = "First name is too short";
            return result;
        }
        if (firstName.length > 45) {
            result.message = "First name is too long";
            return result;
        }
        result.valid = true;
        return result;
    },
    isValidLastName: (lastName) => {
        const result = {valid: false, message: ""};
        if (isNullUndefined(lastName)) {
            result.message = "Missing last name";
            return result;
        }
        if (!isString(lastName)) {
            result.message = "Last name must be a text";
            return result;
        }
        if (lastName.length < 1) {
            result.message = "Last name is too short";
            return result;
        }
        if (lastName.length > 45) {
            result.message = "Last name is too long";
            return result;
        }
        result.valid = true;
        return result;
    }
};

export const emailValidator = {
    isValidEmail: (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const valid = re.test(email);
        const result = {valid: valid, message: !valid ? "Email must be in the format example@domain.com" : ""};
        return result;
    }
};

export const dateValidator = {
    isValidDate: (date) => {
        const valid = isValidDate(date);
        const result = {valid: valid, message: !valid ? `Date ${date} could not be parsed` : ""};
        return result;
    }
};
