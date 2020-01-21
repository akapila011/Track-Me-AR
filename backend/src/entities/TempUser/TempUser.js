import {isString} from "../../util/util";

export function buildCreateTempUser({makeUser, dateValidator}) {
    return function createTempUser({
                                   id, firstName, lastName, email, dateCreated = new Date(), dateInserted = new Date(), expirationDate, code
                               } = {}) {
        const user = makeUser({id, firstName, lastName, email, dateCreated});

        const validInsertionDateResult = dateValidator.isValidDate(dateInserted);
        if (!validInsertionDateResult.valid) {
            throw new Error(`Validation insertion date is invalid. ${validInsertionDateResult.message}`);
        }

        if (expirationDate == null) { //default to 20 minutes
            expirationDate = new Date();
            expirationDate = new Date(expirationDate.setMinutes(dateInserted.getMinutes() + 20));
        }
        const validExpirationDateResult = dateValidator.isValidDate(expirationDate);
        if (!validExpirationDateResult.valid) {
            throw new Error(`Validation expiration date is invalid. ${validExpirationDateResult.message}`);
        }

        if (expirationDate <= dateInserted) {
            throw new Error(`The expiration date for the user verification code cannot be before (or equal) the insertion date.`);
        }

        if (!isString(code)) {
            throw new Error("Validation code must be a valid string");
        }

        if (code.length < 6) {
            throw new Error("Validation code must be at least 6 characters");
        }

        return Object.freeze({
            getId: () => {return user.getId()},
            getFirstName: () => {return user.getFirstName()},
            getLastName: () => {return user.getLastName()},
            getName: () => {return user.getName()},
            getEmail: () => {return user.getEmail()},
            getDateCreated: () => {return user.getDateCreated()},
            getDateInserted: () => {return dateInserted},
            getExpirationDate: () => {return expirationDate},
            isExpired: (date) => {return date > expirationDate},
            getCode: () => {return code;},
        });
    }
}