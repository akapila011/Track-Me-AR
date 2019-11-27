import {makeSaveUser} from "./save-user";
import {usersDb, usersTempDb} from "../data";
import {makeVerifyUser} from "./verify-user";
import {makeSaveTempUser} from "./save-temp-user";


const saveUser = makeSaveUser({usersTempDb});
const saveTempUser = makeSaveTempUser({usersTempDb, usersTempDb, usersDb});  // TODO: change to code generator from util
const verifyUser = makeVerifyUser({usersDb});

export const userService = Object.freeze({
  saveTempUser: saveUser,
    verifyUser: verifyUser,
});