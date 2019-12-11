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

        const validExpirationDateResult = dateValidator.isValidDate(dateInserted);
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
            throw new Error("Validation code must be atleast 6 characters");
        }

        return Object.freeze({
            getId: () => user.id,
            getFirstName: () => user.firstName,
            getLastName: () => user.lastName,
            getName: () => `${user.firstName} ${user.lastName}`,
            getEmail: () => user.email,
            getDateCreated: () => user.dateCreated,
            getDateInserted: () => this.dateInserted,
            getExpirationDate: () => this.expirationDate,
            isExpired: (date) => {return date > this.expirationDate},
            getCode: () => this.code,
        });
    }
}