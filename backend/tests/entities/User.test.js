import createUser from "../../src/entities/User/index";


describe('Entities: createUser', () => {
    it('User ID error on empty id', () => {
        const user = {
            id: "", firstName: "First name", lastName: "Last name", email: "example@domain.com"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User ID error on too long id', () => {
        const user = {
            id: "012345678901234567890123456789abcdef", firstName: "First name", lastName: "Last name", email: "example@domain.com"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User first name must be present', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "", lastName: "Last name", email: "example@domain.com"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User first name cannot be more than 45 chars', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "0123456789012345678901234567890101234567890123456789012345678901", lastName: "Last name", email: "example@domain.com"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User last name must be present', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "First name", lastName: "", email: "example@domain.com"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User last name cannot be more than 45 chars', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "First Name", lastName: "0123456789012345678901234567890101234567890123456789012345678901", email: "example@domain.com"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User must have an email', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "First Name", lastName: "Last name", email: ""
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User must have be in valid format', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "First Name", lastName: "Last name", email: "wrong-domain@1"
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User must have a valid date created', () => {
        const user = {
            id: "01234567890123456789012345678901", firstName: "First Name", lastName: "Last name", email: "wrong-domain@1", dateCreated: null
        };
        expect(() => {createUser(user)}).toThrow();
    });
    it('User is successfully created', () => {
        const dateCreatedNow = new Date();
        const user = {
            id: "01234567890123456789012345678901", firstName: "First Name", lastName: "Last name", email: "example@domain.com", dateCreated: dateCreatedNow
        };
        const expectedUser = Object.freeze({
            getId: () => user.id,
            getFirstName: () => user.firstName,
            getLastName: () => user.lastName,
            getName: () => `${user.firstName} ${user.lastName}`,
            getEmail: () => user.email,
            getDateCreated: () => user.dateCreated
        });
        expect(JSON.stringify(createUser(user))).toEqual(JSON.stringify(expectedUser));
    });
});