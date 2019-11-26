import {makeSaveUser} from "./save-user";
import {usersDb, usersTempDb} from "../data";
import {makeVerifyUser} from "./verify-user";


const saveUser = makeSaveUser({usersTempDb});
const verifyUser = makeVerifyUser({usersDb});

export const userService = Object.freeze({
  saveUser: saveUser,
    verifyUser: verifyUser,
});