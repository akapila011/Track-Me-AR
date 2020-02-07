import createTempUser from "../../src/entities/TempUser/index";


describe('Entities: createTempUser', () => {

    // User fields such as id, first name, email get tested in Entity: createUser so no need to duplicate tests

    it('Date issued cannot be invalid', () => {
        const dateCreated = new Date();
        const expirationDate = new Date();
        const tempUser = {
            id: "01234567890123456789012345678901abcdef", firstName: "First name", lastName: "Last name",
            email: "example@domain.com", dateCreated: dateCreated, dateInserted: null, expirationDate: expirationDate,
            code: "123456"
        };
        expect(() => {createTempUser(tempUser)}).toThrow();
    });

    it('Expiration date cannot be invalid', () => {
        const dateCreated = new Date();
        const dateInserted = new Date();
        const tempUser = {
            id: "01234567890123456789012345678901abcdef", firstName: "First name", lastName: "Last name",
            email: "example@domain.com", dateCreated: dateCreated, dateInserted: dateInserted, expirationDate: null,
            code: "123456"
        };
        expect(() => {createTempUser(tempUser)}).toThrow();
    });

    it('Expiration date must be after insertion date', () => {
        const dateCreated = new Date();
        const dateInserted = new Date();
        const expirationDate = dateInserted;
        const tempUser = {
            id: "012345678901234567890123456789abcdef", firstName: "First name", lastName: "Last name",
            email: "example@domain.com", dateCreated: dateCreated, dateInserted: dateInserted, expirationDate: expirationDate,
            code: "123456"
        };
        expect(() => {createTempUser(tempUser)}).toThrow();
    });

    it('Verification code must be at least 6 characters', () => {
        const dateCreated = new Date();
        const dateInserted = new Date();
        const expirationDate = dateInserted + 1000;
        const tempUser = {
            id: "012345678901234567890123456789abcdef", firstName: "First name", lastName: "Last name",
            email: "example@domain.com", dateCreated: dateCreated, dateInserted: dateInserted, expirationDate: expirationDate,
            code: "12345"
        };
        expect(() => {createTempUser(tempUser)}).toThrow();
    });

    it('Temp User succesfully created', () => {
        const dateCreated = new Date();
        const dateInserted = new Date();
        let expirationDate = new Date();
        expirationDate = new Date(expirationDate.setMinutes(dateInserted.getMinutes() + 20));
        const tempUser = {
            id: "012345678901234567890123456789abcdef", firstName: "First name", lastName: "Last name",
            email: "example@domain.com", dateCreated: dateCreated, dateInserted: dateInserted, expirationDate: expirationDate,
            code: "123456"
        };

        const expectedTempUser = Object.freeze({
            getId: () => tempUser.id,
            getFirstName: () => tempUser.firstName,
            getLastName: () => tempUser.lastName,
            getName: () => `${tempUser.firstName} ${tempUser.lastName}`,
            getEmail: () => tempUser.email,
            getDateCreated: () => tempUser.dateCreated,
            getDateInserted: () => tempUser.dateInserted,
            getExpirationDate: () => tempUser.expirationDate,
            isExpired: (date) => {return date > tempUser.expirationDate},
            getCode: () => tempUser.code,
        });

        expect(JSON.stringify(createTempUser(tempUser))).toEqual(JSON.stringify(expectedTempUser));
    });
});