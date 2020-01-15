
export function buildCreateUser({idValidator, nameValidator, emailValidator, dateValidator}) {
    return function createUser({
        id, firstName, lastName, email, dateCreated = new Date()
                               } = {}) {
        const validIdResult = idValidator.isValidUUID(id);
        if (!validIdResult.valid) {
            throw new Error(validIdResult.message);
        }
        const validFirstNameResult = nameValidator.isValidFirstName(firstName);
        if (!validFirstNameResult.valid) {
            throw new Error(`User first name '${firstName}' is invalid. ${validFirstNameResult.message}`);
        }
        const validLastNameResult = nameValidator.isValidLastName(lastName);
        if (!validLastNameResult.valid) {
            throw new Error(`User last name '${lastName}' is invalid. ${validLastNameResult.message}`);
        }
        const validEmailResult = emailValidator.isValidEmail(email);
        if (!validEmailResult.valid) {
            throw new Error(validEmailResult.message);
        }
        const validDateResult = dateValidator.isValidDate(dateCreated);
        if (!validDateResult.valid) {
            throw new Error(`User's date created value is invalid. ${validDateResult.message}`);
        }

        return {
            getId: () => {return id;},
            getFirstName: () => {return firstName;},
            getLastName: () => {return lastName;},
            getName: () => {return `${firstName} ${lastName}`},
            getEmail: () => {return email;},
            getDateCreated: () => {return dateCreated;}
        };
    }
}