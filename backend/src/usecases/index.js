// import {makeSaveUser} from "./save-user";
import {usersDb, usersTempDb, credentialsDb} from "../data";
import {makeVerifyUser} from "./verify-user";
import {makeSaveTempUser} from "./save-temp-user";
import {codeGenerator, hashing} from "../util/util";
import createCredential from "../entities/Credential";
import {makeCreateCredential} from "./create-credential";
import createTempUser from "../entities/TempUser";
import {makeSignInUserUsecase} from "./sign-in-user";
const jwt = require('jsonwebtoken');
import {getJwtSecretKey} from "../util/config";


// const saveUser = makeSaveUser({usersTempDb});
const saveTempUser = makeSaveTempUser({usersTempDb, codeGenerator, usersDb});
const saveCredential = makeCreateCredential({credentialsDb, createCredential, usersDb});
const verifyUser = makeVerifyUser({usersTempDb, usersDb, createTempUser, createCredential, saveCredential});
const signinUser = makeSignInUserUsecase({usersDb, credentialsDb, hashing, jwtSign: jwt, jwtSecretKey: getJwtSecretKey()});


export const userService = Object.freeze({
  saveTempUser: saveTempUser,
    verifyUser: verifyUser,
    signinUser: signinUser
});