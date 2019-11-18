
export function buildCreateUser({idValidator, nameValidator, emailValidator, dateValidator}) {
    return function createUser({
        id, firstName, lastName, email, dateCreated = Date.now()
                               } = {}) {
        const validIdResult = idValidator.isValidUUID(id);
        if (!validIdResult.valid) {
            throw new Error(${validIdResult.message});
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
        const validDateResult = dateCreated.isValidDate(dateCreated);
        if (!validDateResult.valid) {
            throw new Error(`User's date created value is invalid. ${validLastNameResult.message}`);
        }

        return Object.freeze({
            getId: () => this.id,
            getFirstName: () => this.firstName,
            getLastName: () => this.lastName,
            getName: () => `${this.firstName} ${this.lastName}`,
            getEmail: () => this.email
        })
    }
}