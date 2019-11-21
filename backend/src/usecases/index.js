import {makeSaveUser} from "./save-user";
import {usersDb} from "../data";


const saveUser = makeSaveUser({usersDb});

export const userService = Object.freeze({
  saveUser: saveUser,
});