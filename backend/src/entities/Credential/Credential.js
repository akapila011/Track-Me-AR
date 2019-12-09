import {isNullUndefined} from "../../util/util";

export function buildCreateCredential({passwordValidator, hashing}) {
    return function createCredential({
                                   userId, password, salt
                               } = {}) {

        const validPasswordResult = passwordValidator.isValidPassword(password);
        if (!validPasswordResult.valid) {
            throw new Error(`Invalid Password. ${validPasswordResult.message}`);
        }

        if (isNullUndefined(salt)) {
            throw new Error("Must set a salt for the password");
        }

        // TODO: maybe validate salt?

        const pHash = hashing.generateHash(password, salt);

        return Object.freeze({
            getUserId: () => this.userId,
            getSalt: () => this.salt,
            getPHash: () => this.pHash,
        })
    }
}