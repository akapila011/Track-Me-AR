// import {makeSaveUser} from "./save-user";
import {usersDb, usersTempDb} from "../data";
import {makeVerifyUser} from "./verify-user";
import {makeSaveTempUser} from "./save-temp-user";
import {codeGenerator} from "../util/util";


// const saveUser = makeSaveUser({usersTempDb});
const saveTempUser = makeSaveTempUser({usersTempDb, codeGenerator, usersDb});
const verifyUser = makeVerifyUser({usersDb});

export const userService = Object.freeze({
  saveTempUser: makeSaveTempUser,
    verifyUser: verifyUser,
});