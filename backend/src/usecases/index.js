// import {makeSaveUser} from "./save-user";
import {usersDb, usersTempDb, credentialsDb} from "../data";
import {makeVerifyUser} from "./verify-user";
import {makeSaveTempUser} from "./save-temp-user";
import {codeGenerator} from "../util/util";
import createCredential from "../entities/Credential";
import {makeCreateCredential} from "./create-credential";
import createTempUser from "../entities/TempUser";


// const saveUser = makeSaveUser({usersTempDb});
const saveTempUser = makeSaveTempUser({usersTempDb, codeGenerator, usersDb});
const saveCredential = makeCreateCredential({credentialsDb, createCredential, usersDb});
const verifyUser = makeVerifyUser({usersTempDb, usersDb, createTempUser, createCredential, saveCredential});


export const userService = Object.freeze({
  saveTempUser: saveTempUser,
    verifyUser: verifyUser,
});